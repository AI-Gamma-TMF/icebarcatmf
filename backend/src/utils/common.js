import sharp from 'sharp'
import axios from 'axios'
import AWS from 'aws-sdk'
import bcrypt from 'bcrypt'
import db, { sequelize } from '../db/models'
import jwt from 'jsonwebtoken'
import { Op, Sequelize, QueryTypes } from 'sequelize'
import config from '../configs/app.config'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getOne, getAll, createNewEntity } from './crud'
import { internationalNumberFormatter } from './elastic'
import {
  ADMIN_PERMISSION,
  AMOUNT_TYPE,
  CASINO_ACTION_TYPE,
  OK,
  REGEX,
  ROLE,
  ROLE_ID,
  STRICTLY_REQUIRED_REGISTRATION_FIELDS,
  TIME_ZONES,
  TRANSACTION_STATUS,
  UPLOAD_FILE_SIZE,
  TIMEZONES_WITH_DAYLIGHT_SAVINGS,
  TEMPLATE_CATEGORY
} from './constants/constant'
import CryptoJS from 'crypto-js'
import encode from 'crypto-js/enc-hex'
import crypto from 'crypto'
import { s3 } from '../libs/aws-s3'
import { parse } from 'csv-parse/sync'
import Logger from '../libs/logger'
import { encode as encrypt } from 'hi-base32'
import { Parser } from 'json2csv'
import redisClient from '../libs/redisClient'
import { AffiliatesNotExistErrorType } from './constants/errors'
import { round } from 'lodash'
import { divide, minus, plus } from 'number-precision'
import moment from 'moment'
import AdminNotificationsEmitter from '../socket-resources/emmitter/adminNotification.emitter'
import { SaveAdminNotificationService } from '../services/notification/saveAdminNotification.service'
import md5 from 'js-md5'

dayjs.extend(utc)
dayjs.extend(timezone)

const client = redisClient.client
const s3Config = config.getProperties().s3
export const comparePassword = async (password, userPassword) => {
  if (!password) {
    return false
  }

  const result = await bcrypt.compare(
    Buffer.from(password, 'base64').toString('ascii'),
    userPassword
  )

  return result
}

export const signAccessToken = async ({ name, email, id, role }) => {
  const payload = { email, id, name, role }

  const jwtToken = jwt.sign(payload, config.get('jwt.loginTokenSecret'), {
    expiresIn: config.get('jwt.loginTokenExpiry')
  })

  return jwtToken
}

export const encryptPassword = password => {
  const salt = bcrypt.genSaltSync(10)

  return bcrypt.hashSync(
    Buffer.from(password, 'base64').toString('ascii'),
    salt
  )
}

export const filterByNameEmail = (query, search, model) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col(`${model}.first_name`),
          ' ',
          Sequelize.col(`${model}.last_name`)
        ),
        {
          [Op.iLike]: `%${search}%`
        }
      ),
      { email: { [Op.iLike]: `%${search}%` } }
    ]
  }

  return query
}

export const filterByTitleSlugContent = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      { title: { [Op.iLike]: `%${search}%` } },
      { slug: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } }
    ]
  }

  return query
}

export const filterByName = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const filterByEmailName = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ]
  }
  return query
}

export const filterByDate = (query, startDate = null, endDate = null, modelName, timezone = TIME_ZONES.GMT) => {
  endDate = endDate || new Date()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.col(`${modelName}.updated_at`), '>=', adjustTimestampByTimezone(startDate, timezone)),
        Sequelize.where(Sequelize.col(`${modelName}.updated_at`), '<=', adjustTimestampByTimezone(endDate, timezone))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.col(`${modelName}.updated_at`), '<=', adjustTimestampByTimezone(endDate, timezone))
      ]
    }
  }

  return query
}

export const filterByDateCreated = (query, startDate = null, endDate = null, modelName, timezone = TIME_ZONES.GMT) => {
  endDate = endDate || new Date()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '>=', adjustTimestampByTimezone(startDate, timezone)),
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '<=', adjustTimestampByTimezone(endDate, timezone))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '<=', adjustTimestampByTimezone(endDate, timezone))
      ]
    }
  }

  return query
}

export const filterByDateCreatedAt = (
  query,
  startDate = null,
  endDate = null,
  modelName
) => {
  endDate = endDate || new Date()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '>=', moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')),
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '<=', moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.col(`${modelName}.created_at`), '<=', moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
      ]
    }
  }

  return query
}

export const pageValidation = (pageNo, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(pageNo)
  const sizeAsNumber = Number.parseInt(limit)
  let page = 1
  let size = 15

  if (
    Number.isNaN(pageAsNumber) ||
    pageAsNumber < 0 ||
    Number.isNaN(sizeAsNumber) ||
    sizeAsNumber < 0 ||
    sizeAsNumber > maxSize
  ) {
    return { page, size }
  }

  size = sizeAsNumber
  page = pageAsNumber

  return { page, size }
}

export const keyFilter = (siteRegistration, user) => {
  const keysArray = Object.keys(siteRegistration.dataValues).filter(
    key => siteRegistration[key] === 2 || siteRegistration[key] === 1
  )

  Object.keys(user).forEach(function (key) {
    if (!keysArray.includes(key)) {
      delete user[key]
    }
  })

  return user
}

const s3Client = () => {
  // configuring the AWS environment
  AWS.config.update({
    region: config.get('s3.region')
  })

  return new AWS.S3()
}

function LightenDarkenColor (hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0

  // convert to decimal and change luminosity
  let rgb = '#'
  let c
  let i

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }

  return rgb
}

const lightColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1)
    const newColor = LightenDarkenColor(color, colorVariation)
    value[`light_${colorVariation * 100}`] = newColor
  }

  return value
}

const darkColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1)
    const newColor = LightenDarkenColor(color, colorVariation * -1)
    value[`dark_${colorVariation * 100}`] = newColor
  }

  return value
}

export const themeAttributes = (mode, primaryColor, secondaryColor) => {
  mode = mode.toLowerCase()

  let primary = { main: primaryColor }
  primary = { ...primary, ...darkColor(primaryColor, primary) }
  primary = { ...primary, ...lightColor(secondaryColor, primary) }

  let secondary = { main: secondaryColor }
  secondary = { ...secondary, ...darkColor(secondaryColor, secondary) }
  secondary = { ...secondary, ...lightColor(secondaryColor, secondary) }

  return { palette: { mode, primary, secondary } }
}

export const validateFile = (res, file) => {
  if (!file) {
    return 'FileNotFoundErrorType'
  }
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'FileSizeTooLargeErrorType'
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'pdf', 'webp', 'svg']

    if (!supportedFileType.includes(fileType)) {
      return 'FileTypeNotSupportedErrorType'
    }
  }

  return OK
}

export const validateIconFile = (res, file) => {
  if (!file) {
    return 'FileNotFoundErrorType'
  }
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'FileSizeTooLargeErrorType'
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['svg', 'svg+xml']

    if (!supportedFileType.includes(fileType)) {
      return 'FileTypeNotSupportedErrorType'
    }
  }

  return OK
}

export const uploadFile = (file, filename, key = undefined) => {
  filename = filename.split(' ').join('')
  const bucketParams = {
    Bucket: config.get('s3.bucket'),
    Key: filename,
    Body: file?.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype
  }
  if (key) {
    const deleteParams = {
      Bucket: config.get('s3.bucket'),
      Key: key
    }
    s3Client().deleteObject(deleteParams).promise()
  }

  const s3File = s3.upload(bucketParams).promise()
  return s3File
}

export const fetchFileFromS3 = async (filename) => {
  const bucketParams = {
    Bucket: config.get('s3.bucket'),
    Key: filename
  }

  try {
    // Fetch the file from S3
    const fileData = await s3.getObject(bucketParams).promise()
    // Return file content as a Buffer
    return fileData.Body
  } catch (error) {
    console.error('Error fetching file from S3:', error.message)
  }
}

export const getKey = fileName => {
  const key = fileName.split('amazonaws.com/')[1]
  return key
}

export const dimensionCheck = async (image, height, width) => {
  const size = await sharp(image.buffer).metadata()
  if (height !== size.height && width !== size.width) {
    return false
  }
  return OK
}

export const removeItems = (array, itemsToRemove) => {
  return array.filter(v => {
    return !itemsToRemove.includes(v)
  })
}

export const encodeCredential = (key, encryptKey) => {
  if (!encryptKey) encryptKey = config.get('credentialEncryptionKey')

  return CryptoJS.AES.encrypt(key, encryptKey).toString()
}

export const decodeCredential = (data, object = false) => {
  if (!object) return CryptoJS.AES.decrypt(data, config.get('credentialEncryptionKey')).toString(CryptoJS.enc.Utf8)

  const credentials = []

  data.forEach(credential => {
    credential.value = CryptoJS.AES.decrypt(
      credential.value,
      config.get('credentialEncryptionKey')
    ).toString(CryptoJS.enc.Utf8)
    credentials.push(credential)
  })

  return credentials
}

export const decodeInformation = (data, object = false) => {
  return CryptoJS.AES.decrypt(data, config.get('jwt.secretKey')).toString(
    CryptoJS.enc.Utf8
  )
}

export const filterByNameDomain = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { domain: { [Op.iLike]: `%${search}%` } }
    ]
  }
  return query
}

export const getGlobalRegistration = async Registration => {
  let globalRegistration = await getOne({
    model: db.GlobalSetting,
    data: { key: 'GLOBAL_REGISTRATION' },
    raw: true,
    attributes: ['value']
  })
  globalRegistration = JSON.parse(globalRegistration.value)

  const disable = []
  Object.keys(Registration.dataValues).forEach(key => {
    if (globalRegistration[key] === 2) {
      Registration.dataValues[key] = 2
      disable.push(key)
    }
  })

  Registration.dataValues.disable = [
    ...new Set(disable.concat(STRICTLY_REQUIRED_REGISTRATION_FIELDS))
  ]

  return Registration
}

export const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  const primaryCurrency = await getOne({
    model: db.Currency,
    data: { isPrimary: true }
  })

  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ['exchangeRate']
  })

  const conversionRate =
    parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate
  amount = Math.abs((amount * conversionRate).toFixed(2))
  return { amount, conversionRate }
}

export const topPlayerResponse = data => {
  const response = []
  data.forEach(object => {
    const newData = {}
    Object.keys(object).forEach(key => {
      newData[key.split('.')[key.split('.').length - 1]] = object[key]
      if (
        key.split('.')[key.split('.').length - 1] === 'amount' ||
        key.split('.')[key.split('.').length - 1] === 'depositAmount'
      ) {
        newData[key.split('.')[key.split('.').length - 1]] =
          internationalNumberFormatter(object[key])
      }
    })
    response.push(newData)
  })
  return response
}

export const getOtherCurrenciesAmount = async ({
  amount,
  primary,
  currencyCode
}) => {
  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ['exchangeRate'],
    raw: true
  })

  if (primary) {
    const primaryCurrency = await getOne({
      model: db.Currency,
      data: { isPrimary: true },
      raw: true
    })
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate
    amount = Math.abs((amount * conversionRate).toFixed(2))
    return { amount, conversionRate }
  }

  const targetCurrencies = await getAll({
    model: db.Currency,
    raw: true
  })

  const amountInOtherCurrencies = {}

  targetCurrencies.forEach(currency => {
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate
    amountInOtherCurrencies[currency.code] = Math.abs(
      (amount * conversionRate).toFixed(2)
    )
  })

  return amountInOtherCurrencies
}

export const setLoyaltySequence = levels => {
  const returnList = []
  levels.forEach(level => {
    returnList.push({
      level: level.level,
      startPoint: level.startPoint,
      endPoint: level.endPoint,
      cashback_multiplier: level.cashback_multiplier
    })
  })
  return returnList
}

export const getGameAggregatorAndProvider = async ({ game }) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: game },
    attributes: [],
    include: [
      {
        model: db.MasterCasinoProvider,
        attributes: ['name', 'masterCasinoProviderId'],
        include: [
          {
            model: db.MasterGameAggregator,
            attributes: ['name']
          }
        ]
      }
    ],
    raw: true
  })
  return {
    aggregator: gameData['MasterCasinoProvider.MasterGameAggregator.name'],
    provider: gameData['MasterCasinoProvider.name'],
    providerId: gameData['MasterCasinoProvider.masterCasinoProviderId']
  }
}

export const filterByNameEmailGroup = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('first_name'),
          ' ',
          Sequelize.col('last_name')
        ),
        {
          [Op.iLike]: `%${search}%`
        }
      ),
      { email: { [Op.iLike]: `%${search}%` } },
      { group: { [Op.iLike]: `%${search}%` } }
    ]
  }
  return query
}

export const filterBySearchGroup = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(
        Sequelize.fn(
          'concat',
          Sequelize.col('Package.amount'),
          ' ',
          Sequelize.col('Package.gc_coin'),
          ' ',
          Sequelize.col('Package.sc_coin')
        ),
        {
          [Op.iLike]: `%${search}%`
        }
      ),
      { package_name: { [Op.iLike]: `%${search}%` } }
    ]
  }
  return query
}

export const getLiabilityQuery = ({ adminId }) => {
  let returnQuery

  const upperQuery = `
  SELECT ROUND(cast(sum(wallet.amount) as numeric),2) as liability, my_user.currency_code as "currencyCode" from public.users as my_user
  JOIN public.wallets as wallet on wallet.owner_id = my_user.user_id AND wallet.owner_type = 'user'
  `

  const lowerQuery = `
  GROUP BY my_user.currency_code
  `

  let middleQuery

  if (adminId) {
    if (!middleQuery) middleQuery = `WHERE my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN} `
    if (middleQuery) middleQuery += ` AND my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN}  `
    returnQuery = upperQuery + middleQuery + lowerQuery
  } else {
    if (middleQuery) returnQuery = upperQuery + middleQuery + lowerQuery
    else returnQuery = upperQuery + lowerQuery
  }

  return returnQuery
}

export const removeByAttr = (arr, attr, value) => {
  let index = arr.length
  while (index--) {
    if (arr[index] && arr[index][attr] === value) {
      arr.splice(index, 1)
    }
  }
  return arr
}

export const removeLogo = key => {
  const deleteParams = {
    Bucket: config.get('s3.bucket'),
    Key: key
  }

  s3.deleteObject(deleteParams).promise()
}

export const getAllPortalUserIds = async email => {
  const userIds = []

  const accounts = await getAll({
    model: db.User,
    data: { email },
    attributes: ['userId'],
    raw: true
  })

  for (const user of accounts) {
    userIds.push(user.userId)
  }

  return userIds
}

export const getDetails = async ({ currency, country }) => {
  let currencyId, countryName

  if (currency) {
    const details = await getOne({
      model: db.Currency,
      data: { code: currency },
      attributes: ['currencyId']
    })
    currencyId = details.currencyId
  }

  if (country) {
    const details = await getOne({
      model: db.Country,
      data: { code: country },
      attributes: ['name']
    })
    countryName = details.name
  }

  return { currencyId, countryName }
}

export const getUserDetails = async userId => {
  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [{ model: db.Wallet, as: 'userWallet' }]
  })

  return userDetails
}

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode)
}

export const filterByLanguageName = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ languageName: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const errorResponse = ({ name, message, StatusCodes, errorCode }) => {
  const response = {
    name,
    statusCode: StatusCodes,
    isOperational: true,
    description: message,
    errorCode
  }
  return response
}

export const getElasticURL = () => {
  return (
    process.env.ELASTIC_PROTOCALL +
    process.env.ELASTIC_USER +
    ':' +
    process.env.ELASTIC_PASSWORD +
    '@' +
    process.env.ELASTIC_URL
  )
}

export const formatDate = date => {
  return (
    [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0')
    ].join('') +
    '' +
    [
      date.getUTCHours().toString().padStart(2, '0'),
      date.getUTCMinutes().toString().padStart(2, '0'),
      date.getUTCSeconds().toString().padStart(2, '0')
    ].join('')
  )
}

export const userWalletUpdate = async () => {
  await db.Wallet.update(
    { scCoin: { psc: 0, bsc: 0, wsc: 0 } },
    { where: { wallet_id: { [Op.not]: null } } }
  )
}

export const updateSuperAdminPermissions = async () => {
  await db.AdminUserPermission.update(
    { permission: ADMIN_PERMISSION },
    { where: { adminUserId: await getSuperAdminId() } }
  )
}

export const removeState = async () => {
  const stateIds = (
    await getAll({
      model: db.State,
      data: {
        stateCode: {
          [Op.in]: [
            'AR',
            'GU',
            'PR',
            'MP',
            'VI',
            'UM-79',
            'UM-67',
            'UM-71',
            'UM-86',
            'UM-89',
            'UM-81',
            'UM-84',
            'UM-76',
            'UM-95',
            'UM',
            'DC'
          ]
        }
      },
      attributes: ['stateId']
    })
  ).map(obj => {
    return obj.stateId
  })

  await db.City.destroy({ where: { stateId: { [Op.in]: stateIds } } })
}

export const roundUpBalance = (number, precision = 2) => {
  const decimalIndex = number.toString().indexOf('.')
  if (decimalIndex === -1) {
    return number
  }
  return parseFloat(number.toString().slice(0, decimalIndex + precision + 1))
}

export const convertStringToLowercaseWithDash = async str => {
  return str.toLowerCase().replace(/ /g, '-')
}

export const readCsvFile = async csvFile => {
  let csvData
  let isSuccess = false
  try {
    csvData = await parse(csvFile?.buffer)
    isSuccess = true
  } catch (error) {
    console.log('Csv File reader Error   ', error)
  }
  return { csvData, isSuccess }
}

export const validatePassword = password => {
  return Buffer.from(password, 'base64').toString('utf-8').match(REGEX.PASSWORD)
}

export const getCurrentISOString = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
  const offsetMinutes = now.getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
  const offsetMinutesRemainder = Math.abs(offsetMinutes % 60)
  const offsetSign = offsetMinutes > 0 ? '-' : '+'

  const offsetString = `${offsetSign}${String(offsetHours).padStart(
    2,
    '0'
  )}:${String(offsetMinutesRemainder).padStart(2, '0')}`

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`
}

export const createSignature = ({ payload }) => {
  try {
    Logger.info(`--------------Signature for Veriff------- ${payload}-----`)
    const signature = crypto
      .createHmac('sha256', `${config.get('kycVerification.veriffSecretKey')}`)
      .update(payload)
      .digest('hex')

    return signature
  } catch (error) {
    Logger.error(`Error while creating signature ${JSON.stringify(error)}`)
    return false
  }
}

export const activityLog = async ({
  user,
  userId,
  originalValue,
  changedValue,
  remark,
  moreDetails,
  fieldChanged,
  favorite,
  transaction
}) => {
  await createNewEntity({
    model: db.ActivityLog,
    data: {
      actioneeId: user?.userId || user?.adminUserId,
      actioneeType: user?.userId ? ROLE.USER : ROLE.ADMIN,
      remark,
      fieldChanged,
      originalValue,
      changedValue,
      userId,
      moreDetails: { ...moreDetails, favorite: favorite || false }
    },
    transaction
  })
}

export const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15)
  const base32 = encrypt(buffer).replace(/=/g, '').substring(0, 24)
  return base32
}

export const getSuperAdminId = async () => {
  const admin = await getOne({
    attributes: ['adminUserId'],
    model: db.AdminUser,
    data: { roleId: ROLE_ID.ADMIN }
  })

  return admin.adminUserId
}

export const convertToCsv = ({ fields, data }) => {
  const json2csv = new Parser({ fields })
  const csv = json2csv.parse(data)
  return csv
}

export const getCsvFileName = ({ file, date }) => {
  let fileName = date
    ? `${file}_${new Date(date).toISOString().substring(0, 10)}`
    : `${file}_${new Date().toISOString().substring(0, 10)}`

  fileName = fileName + '.csv'
  return fileName
}

export const tournamentJobScheduler = async (type, tournamentId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/tournament`,
      method: type,
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {
        tournamentId: +tournamentId
      }
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateTierLevel = async transaction => {
  const tiers = await db.Tier.findAll({
    attributes: ['tierId', 'requiredXp', 'level'],
    where: {
      isActive: true
    },
    order: [['requiredXp', 'ASC']],
    transaction
  })

  tiers.sort((a, b) => a.requiredXp - b.requiredXp)

  await Promise.all(
    tiers.map(async (tier, i) => {
      await db.Tier.update(
        { level: i + 1 },
        { where: { tierId: tier.tierId }, transaction }
      )
    })
  )

  return true
}

export const isDateValid = date => {
  date = new Date(date)
  return date instanceof Date && !isNaN(date)
}

export const updateUsersTierJobScheduler = async () => {
  try {
    const options = {
      url: `${config.get('jobScheduler.url')}/tier`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      }
    }
    const { data } = await axios(options)
    console.log(data)
    return data
  } catch (error) {
    console.log(error.response)
    throw error
  }
}

export async function getCachedData (cacheKey) {
  return await client.get(cacheKey)
}

export async function removeData (cacheKey) {
  await client.del(cacheKey)
}

export async function setData (cacheKey, value, expiryTime) {
  if (expiryTime) {
    await client.set(cacheKey, value, 'EX', expiryTime)
  } else {
    await client.set(cacheKey, value)
  }
}

export const generateRandomAlphaNumericCodes = async (amount, length, existingDataSet) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  const codes = new Set()

  while (codes.size < amount) {
    let code = ''
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    if (existingDataSet) {
      if (existingDataSet.includes(code)) codes.add(code)
      else codes.add(code)
    }
  }
  return Array.from(codes)
}

export const getAffiliateByDetails = async (affiliateId) => {
  if (!affiliateId) return false

  const options = {
    url: `${config.get(
      'scaleo.base_url'
    )}/api/v2/network/affiliates/${affiliateId}`,
    method: 'GET',
    params: {
      'api-key': config.get('scaleo.api_key')
    }
  }

  try {
    const { data } = await axios(options)

    // Status = 1 - Active, 2 - Pending, 3 - Inactive
    if (data.code === 200 && data.info?.affiliate?.status === 1 && +data.info?.affiliate?.id === +affiliateId) return affiliateId
    else throw AffiliatesNotExistErrorType
  } catch (error) {
    if (error.response.data.code === 404) throw AffiliatesNotExistErrorType
    throw error
  }
}

export function adjustTimestampByTimezone (timestamp, timezone) {
  const offsetString = TIME_ZONES[timezone?.toUpperCase()] ?? TIME_ZONES.GMT
  const [offsetHours, offsetMinutes] = offsetString.split(':').map(Number)
  const totalOffsetMinutes = (Math.abs(offsetHours) * 60 + offsetMinutes) * Math.sign(offsetHours)
  const offsetMilliseconds = totalOffsetMinutes * 60000

  timestamp = `${getLocaleDate(timestamp, timezone)}${timestamp.substring(10)}`
  const date = new Date(timestamp)
  const adjustedTime = new Date(date.getTime() - offsetMilliseconds)

  return adjustedTime
}

export function getLocaleDate (timestamp, timezone) {
  const offsetString = TIME_ZONES[timezone?.toUpperCase()] ?? TIME_ZONES.GMT
  const [offsetHours, offsetMinutes] = offsetString.split(':').map(Number)
  const totalOffsetMinutes = (Math.abs(offsetHours) * 60 + offsetMinutes) * Math.sign(offsetHours)
  const offsetMilliseconds = totalOffsetMinutes * 60000

  const date = new Date(`${new Date(timestamp).toISOString().substring(0, 10)}${new Date().toISOString().substring(10)}`)
  const adjustedTime = new Date(date.getTime() + offsetMilliseconds)
  return adjustedTime.toISOString().substring(0, 10)
}

export function adjustTimeForCSV (timestamp, timezone) {
  const offsetString = TIME_ZONES[timezone?.toUpperCase()] ?? TIME_ZONES.GMT
  const [offsetHours, offsetMinutes] = offsetString.split(':').map(Number)
  const totalOffsetMinutes = (Math.abs(offsetHours) * 60 + offsetMinutes) * Math.sign(offsetHours)
  const offsetMilliseconds = totalOffsetMinutes * 60000

  const date = new Date(timestamp)
  const adjustedTime = new Date(date.getTime() + offsetMilliseconds)

  return adjustedTime
}

export function formatTime (timestamp) {
  const date = new Date(timestamp).toISOString().substring(0, 10)
  const hours = timestamp.getHours() < 10 ? `0${timestamp.getHours()}` : timestamp.getHours()
  const minutes = timestamp.getMinutes() < 10 ? `0${timestamp.getMinutes()}` : timestamp.getMinutes()
  const seconds = timestamp.getSeconds() < 10 ? `0${timestamp.getSeconds()}` : timestamp.getSeconds()

  return `${date} ${hours}:${minutes}:${seconds}`
}

export const prepareImageUrl = imageUrl => {
  if (imageUrl && imageUrl.indexOf('https://') === -1) {
    return `${s3Config.S3_DOMAIN_KEY_PREFIX}${imageUrl}`
  }
  return imageUrl
}

export const isValidAmount = (amount) => {
  return (!isNaN(amount) && (+amount < 0))
}

export const calculateGGR = async (userId) => {
  let ggr = 0
  const userTransactions = await db.CasinoTransaction.findOne({
    where: {
      userId: userId,
      amountType: AMOUNT_TYPE.SC_COIN,
      status: TRANSACTION_STATUS.SUCCESS
    },
    attributes: [
      // Calculate the total bet amount
      [Sequelize.literal('TRUNC(SUM(CASE WHEN action_type = \'bet\' THEN amount ELSE 0 END)::numeric, 2)'), 'total_sc_bet_amount'],
      // Calculate the total win amount
      [Sequelize.literal('TRUNC(SUM(CASE WHEN action_type = \'win\' THEN amount ELSE 0 END)::numeric, 2)'), 'total_sc_win_amount']
    ],
    raw: true
  })
  if (userTransactions) {
    ggr = +round(+minus(+userTransactions.total_sc_bet_amount, +userTransactions.total_sc_win_amount), 2)
  }
  return +ggr
}

export const calculateNGR = async (userId) => {
  // Calculate GGR = Total Sc Bet - Total Sc Win

  const [totalPurchaseAmount, pendingRedemptionAmount, userWallet] = await Promise.all([
    db.TransactionBanking.findOne({
      where: {
        status: TRANSACTION_STATUS.SUCCESS,
        actioneeId: +userId
      },
      attributes: [
        [Sequelize.literal('TRUNC(SUM(CASE WHEN transaction_type = \'deposit\' THEN amount ELSE 0 END)::numeric, 2)'), 'depositAmount'],
        [Sequelize.literal('TRUNC(SUM(CASE WHEN transaction_type = \'redeem\' THEN amount ELSE 0 END)::numeric, 2)'), 'redeemAmount']
      ],
      raw: true
    }),
    db.WithdrawRequest.findOne({
      where: {
        userId: +userId,
        [Op.or]: [
          { status: TRANSACTION_STATUS.INPROGRESS },
          { status: TRANSACTION_STATUS.PENDING }
        ]
      },
      attributes: [
        [Sequelize.fn('SUM', sequelize.col('amount')), 'pendingAmount'],
        [Sequelize.fn('COUNT', sequelize.col('withdraw_request_id')), 'redemptionCount']
      ],
      raw: true
    }),
    db.Wallet.findOne({
      where: { ownerId: +userId },
      attributes: ['scCoin'],
      raw: true
    })
  ])

  // Calculate NGR = Purchase amount in $ - pending redemption - approved redemption - SC balance
  let ngr = +round(+minus(+totalPurchaseAmount?.depositAmount, +totalPurchaseAmount?.redeemAmount), 2) || 0

  if (pendingRedemptionAmount?.pendingAmount) {
    ngr = +round(+minus(+ngr, +pendingRedemptionAmount.pendingAmount), 2)
  }

  if (userWallet) {
    const currentScBalance = +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.psc, +userWallet.scCoin.wsc), 2)
    ngr = +round(+minus(+ngr, +currentScBalance), 2)
  }

  return +ngr
}

export const calculateNgrGgr = async (userReport) => {
  const user = await db.User.findOne({
    where: { userId: userReport?.userId },
    attributes: [
      'userId',
      [sequelize.literal(`(SELECT created_at FROM "transaction_bankings" WHERE transaction_type = 'redeem' AND status = '${TRANSACTION_STATUS.SUCCESS}'AND "transaction_bankings".actionee_Id = "User"."user_id"  ORDER BY created_at DESC LIMIT 1)`), 'lastRedeemApprovedDate'],
      [sequelize.literal(`(SELECT amount FROM "transaction_bankings" WHERE transaction_type = 'redeem' AND status = '${TRANSACTION_STATUS.SUCCESS}'AND "transaction_bankings".actionee_Id = "User"."user_id"  ORDER BY created_at DESC LIMIT 1)`), 'lastApprovedRedeemAmount'],
      [
        sequelize.literal(`(
              SELECT 
                TRUNC(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END)::numeric, 2)
              FROM "transaction_bankings" AS tb
              WHERE 
                tb.status = '${TRANSACTION_STATUS.SUCCESS}' 
                AND tb.actionee_id = "User"."user_id" 
                AND tb.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'totalDepositAmount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                TRUNC(SUM(CASE WHEN transaction_type = 'redeem' THEN amount ELSE 0 END)::numeric, 2)
              FROM "transaction_bankings" AS tb
              WHERE 
                tb.status = '${TRANSACTION_STATUS.SUCCESS}' 
                AND tb.actionee_id = "User"."user_id" 
                AND tb.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'totalRedeemAmount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                COUNT(CASE WHEN transaction_type = 'deposit' THEN 1 END)
              FROM "transaction_bankings" AS tb
              WHERE 
                tb.status = '${TRANSACTION_STATUS.SUCCESS}' 
                AND tb.actionee_id = "User"."user_id" 
                AND tb.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'purchaseCount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                COUNT(CASE WHEN transaction_type = 'redeem' THEN 1 END)
              FROM "transaction_bankings" AS tb
              WHERE 
                tb.status = '${TRANSACTION_STATUS.SUCCESS}' 
                AND tb.actionee_id = "User"."user_id" 
                AND tb.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'redemptionCount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                TRUNC(SUM(CASE WHEN wr.status = '${
                  TRANSACTION_STATUS.PENDING
                }' OR wr.status = '${TRANSACTION_STATUS.INPROGRESS}' THEN amount ELSE 0 END)::numeric, 2)
              FROM "withdraw_requests" AS wr
              WHERE 
                wr.user_id = "User"."user_id" 
                AND (wr.status = '${
                  TRANSACTION_STATUS.INPROGRESS
                }' OR wr.status = '${TRANSACTION_STATUS.PENDING}')
                AND wr.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'totalPendingRedemptionAmount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                COUNT(CASE WHEN wr.status = '${
                  TRANSACTION_STATUS.PENDING
                }' OR wr.status ='${TRANSACTION_STATUS.INPROGRESS}' THEN 1 END)
              FROM "withdraw_requests" AS wr
              WHERE 
                wr.user_id = "User"."user_id"
                AND (wr.status = '${
                  TRANSACTION_STATUS.INPROGRESS
                }' OR wr.status = '${TRANSACTION_STATUS.PENDING}')
                AND wr.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'pendingRedemptionCount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                COUNT(CASE WHEN wr.status = '${
                  TRANSACTION_STATUS.CANCELED
                }' THEN 1 END)
              FROM "withdraw_requests" AS wr
              WHERE 
                wr.user_id = "User"."user_id"
                AND wr.status = '${TRANSACTION_STATUS.CANCELED}' 
                AND wr.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'cancelledRedemptionCount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                TRUNC(COALESCE(SUM(CASE WHEN action_type = 'bet' THEN NULLIF(amount, 'NaN') ELSE 0 END), 0)::numeric, 2)
              FROM "casino_transactions" AS ct
              WHERE 
                ct.user_id = "User"."user_id" 
                AND ct.amount_type = '${AMOUNT_TYPE.SC_COIN}' 
                AND ct.status = '${TRANSACTION_STATUS.SUCCESS}'
                AND ct.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'totalScBetAmount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                TRUNC(COALESCE(SUM(CASE WHEN action_type = 'win' THEN NULLIF(amount, 'NaN') ELSE 0 END), 0)::numeric, 2)
              FROM "casino_transactions" AS ct
              WHERE 
                ct.user_id = "User"."user_id" 
                AND ct.amount_type = '${AMOUNT_TYPE.SC_COIN}' 
                AND ct.status = '${TRANSACTION_STATUS.SUCCESS}'
                AND ct.created_at BETWEEN '${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'
            )`),
        'totalScWinAmount'
      ],
      [
        sequelize.literal(`(
              SELECT 
                wr.sc_coin
              FROM "wallets" AS wr
              WHERE 
                wr.owner_id = "User"."user_id"
            )`),
        'scCoin'
      ],
      [
        sequelize.literal(`(
              SELECT 
                wr.vault_sc_coin
              FROM "wallets" AS wr
              WHERE 
                wr.owner_id = "User"."user_id"
            )`),
        'vaultScCoin'
      ]
    ],
    raw: true
  })

  const calculatedGgr = +round(+minus(+user.totalScBetAmount, +user.totalScWinAmount), 2)

  const totalPurchaseAmount = +round(+plus(+userReport.totalPurchaseAmount, +user.totalDepositAmount), 2)
  const totalPendingRedemptionAmount = +round(+plus(+userReport.totalPendingRedemptionAmount, +user.totalPendingRedemptionAmount), 2)
  const totalRedemptionAmount = +round(+plus(+userReport.totalRedemptionAmount, +user.totalRedeemAmount), 2)

  // Calculate NGR = Purchase amount in $ - pending redemption - approved redemption - SC balance - vault balance
  let ngr = +round(+minus(+totalPurchaseAmount, +totalRedemptionAmount), 2) || 0

  if (totalPendingRedemptionAmount) {
    ngr = +round(+minus(+ngr, +totalPendingRedemptionAmount), 2)
  }

  if (user?.scCoin) {
    const currentScBalance = +round(+plus(+user.scCoin.bsc, +user.scCoin.psc, +user.scCoin.wsc), 2)
    ngr = +round(+minus(+ngr, +currentScBalance), 2)
  }

  if (user?.vaultScCoin) {
    const currentVaultScBalance = +round(+plus(+user.vaultScCoin.bsc, +user.vaultScCoin.psc, +user.vaultScCoin.wsc), 2)
    ngr = +round(+minus(+ngr, +currentVaultScBalance), 2)
  }

  return {
    ngr,
    ggr: +round(+plus(+userReport.ggr, +calculatedGgr), 2),
    totalPurchaseAmount,
    purchaseCount: +round(+plus(+userReport.purchaseCount, +user.purchaseCount), 2),
    totalRedemptionAmount: totalRedemptionAmount,
    redemptionCount: +round(+plus(+userReport.redemptionCount, +user.redemptionCount), 2),
    totalPendingRedemptionAmount: totalPendingRedemptionAmount,
    pendingRedemptionCount: +round(+plus(+userReport.pendingRedemptionCount, +user.pendingRedemptionCount), 2),
    totalScBetAmount: +round(+plus(+userReport.totalScBetAmount, +user.totalScBetAmount), 2),
    totalScWinAmount: +round(+plus(+userReport.totalScWinAmount, +user.totalScWinAmount), 2),
    cancelledRedemptionCount: +round(+plus(+userReport.cancelledRedemptionCount, +user.cancelledRedemptionCount), 2),
    lastApprovedRedeemDate: user.lastRedeemApprovedDate || null,
    lastApprovedRedeemAmount: user.lastApprovedRedeemAmount || 0
  }
}

export const deleteSubCategoryKeys = async () => {
  let cursor = '0'
  try {
    do {
      const [newCursor, keys] = await client.scan(cursor, 'MATCH', 'subCategoryData-*', 'COUNT', 100)
      cursor = newCursor
      await Promise.all(keys.map(async key => { removeData(key) }))
    } while (cursor !== '0')
  } catch (error) {
    console.log(error)
  }
}

export const calculateDateTimeForAggregatedData = (endDate) => {
  if (new Date(endDate) < new Date()) { return { aggregatedEndDate: endDate, sumStartDate: null } }

  const date = new Date()
  // Getting aggregated date endDate
  const aggregatedEndDate = new Date(date)
  aggregatedEndDate.setMinutes((Math.floor(date.getMinutes() / 30) * 30) - 31)
  aggregatedEndDate.setSeconds(59)
  aggregatedEndDate.setMilliseconds(999)

  // Get normal query startDate
  const sumStartDate = new Date(aggregatedEndDate)
  sumStartDate.setMilliseconds(aggregatedEndDate.getMilliseconds() + 1)

  return {
    aggregatedEndDate: aggregatedEndDate,
    sumStartDate: sumStartDate
  }
}

export const clearUserStatuses = (userDetails) => {
  userDetails.isBan = false
  userDetails.isActive = true
  userDetails.isRestrict = false
  return userDetails
}

// user-change status for restrict:
export const updateUserRestrictedStatusScaleo = async (clickId, action) => {
  const option = {
    url: `${config.get('scaleo.base_url')}/api/v2/network/tracker/user-change`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      'api-key': config.get('scaleo.api_key')
    },
    data: {
      click_id: clickId,
      status: action ? 'restricted' : 'active',
      status_details: action ? 'fraud' : 'not-fraud',
      verified: action ? 'not_verified' : 'verified',
      change_commission_status: action ? 'rejected' : null
    }
  }
  try {
    console.log('optionss---------', option)
    const { data } = await axios(option)
    if (data.code === 200 && data.status === 'success') return { message: data.message, status: data.status }
    else {
      const errorMessage = data?.message || 'An error occurred'
      const errorDetails = data?.info?.errors?.click_id?.[0] || 'Unknown error'
      return {
        message: errorMessage,
        error: errorDetails,
        status: 'failed'
      }
    }
  } catch (error) {
    console.log('Error occur in While Changing the User Restrict Status', JSON.stringify(error.response.data))
    throw error
  }
}

export const generateCsvFilename = (filters, staticCsvName) => {
  // Define keys to exclude
  const excludeKeys = new Set(['csvDownload', 'limit', 'pageNo'])

  // Filter out empty values and specified keys to exclude
  const filenameParts = Object.entries(filters)
    .filter(([key, value]) => value && !excludeKeys.has(key)) // Exclude specified keys and empty values
    .map(([key, value]) => `${key}-${value}`)
    .join('_')

  // Default filename if no filters are present
  return filenameParts.length > 0
    ? `${staticCsvName}_${filenameParts}.csv`
    : 'your_streaming_data.csv'
}

export const redeemRequestAction = async ({ req, data }) => {
  const option = {
    url: `${config.get('adminBeUrl')}/api/v1/payment/redeem-requests`,
    method: 'PUT',
    headers: {
      Cookie: req.headers.cookie,
      'Content-Type': 'application/json'
    },
    data
  }

  try {
    await axios(option)
  } catch (error) {
    console.log(JSON.stringify(error.response.data))
  }
}

export const refreshMaterializedView = async (transaction) => {
  await sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY game_data_view;', { transaction })

  // refresh table games slot games on redis
  const slotGamesArray = await sequelize.query(`
    SELECT sub_category_name, master_casino_game_id
    FROM public.game_data_view gdv
    where gdv.sub_category_id is not null
    and sub_category_name in ('Slots'); 
  `,
  { type: QueryTypes.SELECT, transaction }
  )

  const tableGamesArray = await sequelize.query(`
    SELECT sub_category_name, master_casino_game_id
    FROM public.game_data_view gdv
    where gdv.sub_category_id is not null
    and sub_category_name in ('Table Games'); 
  `,
  { type: QueryTypes.SELECT, transaction }
  )

  await setData('WHALE_NOTIFICATION_SLOT_GAMES', JSON.stringify(slotGamesArray))
  await setData('WHALE_NOTIFICATION_TABLE_GAMES', JSON.stringify(tableGamesArray))
}

export const exportCenterAxiosCall = async (body) => {
  try {
    await axios({
      url: `${config.get('jobScheduler.url')}/csv/downloadCenter`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: body
    })
    return true
  } catch (error) {
    console.log('Error While making export center axios call', error)
    throw error
  }
}

export const getUserTierDetails = async (userId) => {
  const userCurrentTier = await db.UserTier.findOne({
    where: {
      userId
    },
    include: [
      {
        model: db.Tier,
        attributes: ['name', 'requiredXp', 'level'],
        where: {
          isActive: true
        }
      }
    ]
  })

  const userPromotedLevel = userCurrentTier?.promotedTierLevel || 0
  let currentPromotedTier
  const userLevelPromotedCondition = userPromotedLevel > 0 && (+userPromotedLevel >= +userCurrentTier?.level)
  if (userLevelPromotedCondition) {
    currentPromotedTier = await db.Tier.findOne({
      attributes: ['tierId', 'name', 'requiredXp', 'level'],
      where: {
        level: userPromotedLevel,
        isActive: true
      },
      raw: true
    })
  }
  return {
    currentTier: userLevelPromotedCondition ? currentPromotedTier : userCurrentTier?.Tier,
    level: userLevelPromotedCondition ? currentPromotedTier.level : userCurrentTier?.level,
    promotedLevel: userPromotedLevel || 0
  }
}
// Function to handle image conversion
export const convertToWebPAndUpload = async (file, filePath, key = undefined) => {
  const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer)
  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()

  const fileObject = {
    buffer: webpBuffer,
    mimetype: 'image/webp'
  }

  await uploadFile(fileObject, filePath, key = undefined)
  return filePath
}

// tournamentPayoutJobScheduler
export const tournamentPayoutJobScheduler = async (type, tournamentId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/tournament/payout`,
      method: type,
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {
        tournamentId: +tournamentId
      }
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export function checkIfIntOrNull (input) {
  if (input === null || input === '' || input === 'null') {
    return null
  }
  const parsedValue = Number(input)
  if (!isNaN(parsedValue) && parsedValue > 0 && Number.isInteger(parsedValue)) {
    // Valid number
    return parsedValue
  }
  // Invalid input
  return null
}

// Query for perDayData
export const tournamentStatsPerDayByCustomQuery = async (customQuery) => {
  const rawData = await db.CasinoTransaction.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('created_at')), 'transactionDate'],
      [sequelize.literal(`SUM(CASE WHEN action_type = '${CASINO_ACTION_TYPE.BET}' THEN amount ELSE 0 END)`), 'bet'],
      [sequelize.literal(`SUM(CASE WHEN action_type = '${CASINO_ACTION_TYPE.WIN}' THEN amount ELSE 0 END)`), 'win']
    ],
    where: customQuery,
    group: ['transactionDate'],
    order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
    raw: true
  })

  const tournamentStats = []
  let cumulativeBet = 0
  let cumulativeWin = 0

  rawData.forEach(({ transactionDate, bet, win }) => {
    cumulativeBet += +round(+bet, 2) || 0
    cumulativeWin += +round(+win, 2) || 0

    tournamentStats.push({
      date: transactionDate,
      playerBet: cumulativeBet,
      playerWon: cumulativeWin,
      playerGGR: +round(+minus(+cumulativeBet, +cumulativeWin), 2)
    })
  })

  return {
    tournamentStats,
    totalWin: +round(cumulativeWin, 2),
    totalBet: +round(cumulativeBet, 2),
    ggr: +round(+minus(+cumulativeBet, +cumulativeWin), 2)
  }
}

export const createOptimovePromocode = async (promocode, name) => {
  try {
    const options = {
      url: `${config.get('optimove.base_url')}/Integrations/AddPromotions`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify([
        {
          PromoCode: promocode,
          PromotionName: name
        }
      ])
    }
    // Adding promotions in optimove servers.
    await axios(options)
    return true
  } catch (error) {
    console.log('Error While creating  promocode at optimove server', error)
    throw error
  }
}

export const deleteOptimovePromocode = async (promocode) => {
  try {
    const options = {
      url: `${config.get('optimove.base_url')}/Integrations/DeletePromotions`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify([
        {
          PromoCode: promocode
        }
      ])
    }
    // Deleting promotions in optimove servers.
    await axios(options)
    return true
  } catch (error) {
    console.log('Error While creating  promocode at optimove server', error)
    throw error
  }
}

export const userReportsRealTimeJobScheduler = async (jobData) => {
  try {
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/user-reports`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: jobData
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export const dynamicEmailTemplatesValues = (templateCategory = null) => {
  const dynamicFieldMapping = {
    email: 'email',
    phone: 'phone',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    dateOfBirth: 'dateOfBirth',
    kycStatus: 'kycStatus',
    tierName: 'tierName',
    tierLevel: 'tierLevel',
    totalScCoin: 'totalScCoin',
    totalGcCoin: 'totalGcCoin',
    totalVaultScCoin: 'totalVaultScCoin',
    totalVaultGcCoin: 'totalVaultGcCoin',
    currentXp: 'currentXp'
  }

  const freeSpinDynamicValue = {
    email: 'email',
    phone: 'phone',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    gameName: 'gameName',
    freeSpinAmount: 'freeSpinAmount',
    freeSpinRound: 'freeSpinRound',
    startDate: 'startDate',
    expiryDate: 'endDate',
    coin: 'coinType'
  }
  return (templateCategory === TEMPLATE_CATEGORY.FREE_SPIN) ? freeSpinDynamicValue : dynamicFieldMapping
}

export const getNestedValue = (obj, path, defaultValue = '') => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj)
}
export const injectDynamicDataInTemplate = ({ template, dynamicData }) => {
  let returnEmail = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{ *${dynamicKey} *}}`, 'g')
    returnEmail = returnEmail.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnEmail
}

export const isValidCsvFile = (file) => {
  if (!file) {
    return 'FileNotFoundErrorType'
  }
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'FileSizeTooLargeErrorType'
  }

  const validMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/csv'
  ]
  const validExtensions = ['csv']

  const mimeTypeValid = validMimeTypes.includes(file.mimetype)
  const extensionValid = validExtensions.includes(
    file.originalname.split('.').pop().toLowerCase()
  )

  return (mimeTypeValid && extensionValid) ? OK : false
}
export const filterByTitle = (query, search) => {
  search = search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }]
  }
  return query
}

export const validateCsvFile = (file) => {
  const fileSize = file.size

  if (fileSize <= 0) {
    throw new Error('Invalid file size')
  }

  if (fileSize > UPLOAD_FILE_SIZE) return false

  const validMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/csv'
  ]
  const validExtensions = ['csv']

  const mimeTypeValid = validMimeTypes.includes(file.mimetype)
  const extensionValid = validExtensions.includes(
    (file.originalname.split('.').pop()).toLowerCase()
  )
  return mimeTypeValid && extensionValid
}

export function calculateUTCDateRangeForTimezoneRange (startDate, endDate, timezone) {
  // Validate timezone
  let offsetString
  offsetString = TIME_ZONES[timezone?.toUpperCase()]
  if (!offsetString) {
    offsetString = TIME_ZONES.GMT
  }
  // Parse the offset
  const [offsetHours, offsetMinutes] = offsetString.split(':').map(Number)

  const totalOffsetMilliseconds =
    (Math.abs(offsetHours) * 60 + (offsetMinutes || 0)) * 60000 * Math.sign(offsetHours)

  // Convert start date and end date to UTC
  const startDateInTimezone = new Date(`${startDate}T00:00:00`)
  const endDateInTimezone = new Date(`${endDate}T23:59:59`)

  const startDateUTC = new Date(startDateInTimezone.getTime() - totalOffsetMilliseconds)
  const endDateUTC = new Date(endDateInTimezone.getTime() - totalOffsetMilliseconds)

  return {
    startDateUTC: startDateUTC.toISOString(),
    endDateUTC: endDateUTC.toISOString()
  }
}

export function calculateDate (validTill, validFrom, timezone) {
  const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone.toUpperCase()] || 'Etc/GMT'
  const result = {}

  if (validFrom) {
    const safeStart = dayjs(validFrom).tz(userTimezone).startOf('day')
    result.startDate = safeStart.utc().toDate()
  }

  if (validTill) {
    const safeEnd = dayjs(validTill).tz(userTimezone).endOf('day')
    result.endDate = safeEnd.utc().toDate()
  }

  return result
}

export const filterByStartEndDate = (
  query,
  startDate = null,
  endDate = null,
  modelName
) => {
  endDate = endDate || new Date()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.col(`${modelName}.start_date`), '>=', moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')),
        Sequelize.where(Sequelize.col(`${modelName}.end_date`), '<=', moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.col(`${modelName}.end_date`), '<=', moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
      ]
    }
  }
  return query
}

export const triggerPackageActivationNotification = async (name, cost, amountGC, amountSC, adminId, packageId, status) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_PACKAGE_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: `Package ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
    message: `An admin just ${status} a package ${name} costing ${cost} with ${amountGC} GC and ${amountSC} SC. 
    Please check the package details.`,
    type: 'PACKAGE_ALERT',
    subtype: status.toUpperCase(),
    data: {
      adminId: adminId,
      amount: cost,
      amountSC: amountSC,
      amountGC: amountGC,
      name: name,
      packageId
    },
    link: '/admin/packages',
    image: '',
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

export const triggerTournamentNotification = async (name, entryAmount, amountGC, amountSC, startDate, endDate, adminId, imageUrl) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: 'New Tournament Added!',
    message: `An admin just added a new tournament: ${name}, joining amount: ${entryAmount} SC with rewards ${amountGC} GC and ${amountSC} SC.
    Please check the tournament details.`,
    type: 'TOURNAMENT',
    subtype: 'ACTIVATION',
    data: {
      adminId,
      amount: entryAmount,
      amountSC,
      amountGC,
      name,
      startDate,
      endDate
    },
    link: '/admin/tournament',
    image: imageUrl,
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

export const triggerTournamentUpdateNotification = async (name, entryAmount, amountGC, amountSC, startDate, endDate, adminId, imageUrl) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: 'Tournament Updated!',
    message: `An admin just updated tournament: ${name}, joining amount: ${entryAmount} SC with rewards ${amountGC} GC and ${amountSC} SC.
    Please check the tournament details.`,
    type: 'TOURNAMENT',
    subtype: 'UPDATED',
    data: {
      adminId,
      amount: entryAmount,
      amountSC,
      amountGC,
      name,
      startDate,
      endDate
    },
    link: '/admin/tournament',
    image: imageUrl,
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

export const triggerTournamentCancelNotification = async (name, entryAmount, amountGC, amountSC, startDate, endDate, adminId, imageUrl) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: 'Tournament Cancelled!',
    message: `An admin just cancelled tournament: ${name}.
    Please check the tournament details.`,
    type: 'TOURNAMENT',
    subtype: 'CANCELLED',
    data: {
      adminId,
      amount: entryAmount,
      amountSC,
      amountGC,
      name,
      startDate,
      endDate
    },
    link: '/admin/tournament',
    image: imageUrl,
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

export const triggerGiveawayNotification = async (name, amountGC, amountSC, adminId, status) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: `Giveaway ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
    message: `An admin just ${status} a Giveaway: ${name} with ${amountGC} GC and ${amountSC} SC.
    Please check the giveaway details.`,
    type: 'GIVEAWAY',
    subtype: status.toUpperCase(),
    data: {
      adminId: adminId,
      amountSC: amountSC,
      amountGC: amountGC,
      name: name
    },
    link: '/admin/raffle',
    image: '',
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

export const triggerGiveawayChangeNotification = async (name, adminId, status) => {
  const trigger = await getConfigurableSettings('ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION')
  if (trigger === 'false') {
    return
  }

  const notificationObj = {
    title: `Giveaway ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
    message: `An admin just ${status} a Giveaway: ${name}.
    Please check the giveaway details.`,
    type: 'GIVEAWAY',
    subtype: status.toUpperCase(),
    data: {
      adminId: adminId,
      name: name
    },
    link: '/admin/raffle',
    image: '',
    sender_type: 'ADMIN',
    sender_id: adminId,
    priority: 'MEDIUM'
  }

  const id = await SaveAdminNotificationService.run(notificationObj)
  notificationObj.id = id

  AdminNotificationsEmitter.emitNotificationToAllAdmins(notificationObj)
}

const getConfigurableSettings = async (keyName) => { // function to get configurable settings from db
  const cachedData = await getCachedData(keyName)
  if (cachedData) {
    return cachedData
  }

  const data = await db.GlobalSetting.findOne({
    where: {
      key: keyName
    },
    attributes: ['key', 'value'],
    raw: true
  })

  await setData(keyName, data?.value)

  return data?.value
}

export const updateRedeemJobTime = async (ruleId) => {
  try {
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/transaction/redeem-job-time`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {
        ruleId: +ruleId
      }
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export const updateMaintenanceModeJobTime = async (maintenanceModeId) => {
  try {
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/maintenance-mode/update-time`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {
        maintenanceModeId: +maintenanceModeId
      }
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export async function deleteAllTokens () {
  let cursor = '0'
  do {
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', 'user:*', 'COUNT', 100)
    if (keys.length) await client.del(...keys)
    cursor = nextCursor
  } while (cursor !== '0')

  cursor = '0'
  do {
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', 'gamePlay:*', 'COUNT', 100)
    if (keys.length) await client.del(...keys)
    cursor = nextCursor
  } while (cursor !== '0')
}

export const updateRibbonData = async () => {
  try {
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/maintenance-mode/ribbon`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {}
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export const tierGlobalSettingData = async (transaction = {}) => {
  const data = await client.get('tier-global-setting-data')

  if (data) return JSON.parse(data)

  const [{ value: SC_TO_GC_RATE }, { value: XP_SC_TO_GC_RATE }] = await db.GlobalSetting.findAll({
    attributes: ['key', 'value'],
    where: {
      key: ['SC_TO_GC_RATE', 'XP_SC_TO_GC_RATE']
    },
    ...transaction,
    raw: true
  })

  const values = {
    SC_TO_GC_RATE,
    XP_SC_TO_GC_RATE
  }

  await client.set('tier-global-setting-data', JSON.stringify(values))
  return values
}

export const isUserOnline = async (uniqueId) => {
  try {
    const exists = await client.exists(`user:${uniqueId}`)
    return exists === 1 // Returns true if user is online, false otherwise
  } catch (error) {
    console.error('Error checking user online status:', error)
    return false
  }
}

export function jackpotWinningTicketRnG (seedAmount, maxTicketSize, adminShare) {
  let minTickets = +Math.ceil(+divide(+seedAmount, +adminShare || 1))

  if (+minTickets >= +maxTicketSize) return 'NO_JACKPOT_BREAK_EVEN'

  if (+divide(+maxTicketSize, 2) > +minTickets) minTickets = +Math.ceil(+divide(+maxTicketSize, 2))

  const min = minTickets + 1
  const max = +maxTicketSize

  if (max <= min) return 'NO_JACKPOT_BREAK_EVEN'

  const winningTicket = crypto.randomInt(min, max)
  return winningTicket
}

export const statusUpdateJobScheduler = async (method, type, id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/status-update`,
      method: method,
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: { type: type, id: +id }
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const transformBonusData = (/* data */ input) => {
  const result = {}
  const excludeKeys = ['bonusData', 'firstPurchaseBonus', 'wheelSpinBonus']

  for (const timeRange in input) {
    const categories = input[timeRange]

    for (const category in categories) {
      if (excludeKeys.includes(category)) continue
      if (!result[category]) {
        result[category] = {}
      }

      result[category][timeRange] = categories[category]
    }
  }

  return result
}

//  job create for notify user email:
export const notifyUserByEmailJobScheduler = async ({ usersEmail, emailTemplateId, freeSpinId }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/email`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: { usersEmail, emailTemplateId, freeSpinId }
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const calculatePragmaticHash = (parameters, secretKey) => {
  delete parameters.hash

  const sortedParameters = Object.keys(parameters)
    .sort()
    .map(key => `${key}=${parameters[key]}`)
    .join('&')

  const dataToHash = `${sortedParameters}${secretKey}`
  const hash = md5(dataToHash)
  return hash
}
export const subscriptionFeatureTypeCheck = (activeFeatures, featuresData) => {
  const errors = []

  for (let i = 0; i < activeFeatures.length; i++) {
    const definedValue = activeFeatures[i]
    const actualValue = featuresData[definedValue.key]

    if (definedValue.valueType === 'integer') {
      if (!Number.isInteger(actualValue)) {
        errors.push(`Key "${definedValue.key}" expected integer but got ${typeof value} (${actualValue})`)
      }
    } else if (definedValue.valueType === 'float') {
      if (typeof actualValue !== 'number' || Number.isNaN(actualValue)) {
        errors.push(`Key "${definedValue.key}" expected float but got ${typeof value} (${actualValue})`)
      }
    } else if (definedValue.valueType === 'boolean') {
      if (typeof actualValue !== 'boolean') {
        errors.push(`Key "${definedValue.key}" expected boolean but got ${typeof value} (${actualValue})`)
      }
    } else {
      errors.push(`Unknown valueType "${definedValue.valueType}" for key "${definedValue.key}"`)
    }
  }

  if (errors.length > 0) this.addError('SubscriptionFeatureValueTypeErrorType', errors)
  return true
}

export const removeAllSubKeysData = async (keyName) => {
  const client = redisClient.client

  return new Promise((resolve) => {
    const stream = client.scanStream({
      match: keyName.endsWith('*') ? keyName : `${keyName}*`,
      count: 100
    })
    const deletionPromises = []
    stream.on('data', (keys) => {
      if (keys.length) {
        deletionPromises.push(client.del(...keys))
      }
    })
    stream.on('end', async () => {
      try {
        await Promise.all(deletionPromises)
        resolve(true)
      } catch (err) {
        console.error('Error deleting keys:', err)
        resolve(false)
      }
    })
    stream.on('error', (err) => {
      console.error('Stream error:', err)
      resolve(false)
    })
  })
}

export const cancelledEnabledFreeSpinJobScheduler = async (payload) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { data } = await axios({
      url: `${config.get('jobScheduler.url')}/freeSpinCancelledStatus`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: payload
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const dateTimeUTCConversion = (startDate = null, endDate = null, timezone = 'UTC') => {
  const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone.toUpperCase()] || 'Etc/UTC'
  const now = dayjs().tz(userTimezone)

  const parseDate = (dateStr, isEnd = false) => {
    if (!dateStr) return null
    const hasTime = /\d{1,2}:\d{2}/.test(dateStr) // detect HH:mm in string
    const dateObj = dayjs.tz(dateStr, userTimezone)
    return hasTime
      ? dateObj // keep time as is
      : isEnd
        ? dateObj.endOf('day')
        : dateObj.startOf('day')
  }

  const safeStart = parseDate(startDate) || now.clone().startOf('day')
  const safeEnd = parseDate(endDate, true) || now.clone().endOf('day')

  return {
    startDate: safeStart.utc().toDate(),
    endDate: safeEnd.utc().toDate(),
    last7dayStart: now.clone().subtract(7, 'day').startOf('day').utc().toDate(),
    todayStart: now.clone().startOf('day').utc().toDate(),
    todayEnd: now.clone().endOf('day').utc().toDate(),
    startOfMonth: now.clone().startOf('month').utc().toDate(),
    endOfMonth: now.clone().endOf('month').utc().toDate()
  }
}
