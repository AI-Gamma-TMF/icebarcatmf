import axios from 'axios'
import db from '../db/models'
import CryptoJS from 'crypto-js'
import { Parser } from 'json2csv'
import sgMail from '@sendgrid/mail'
import logger from '../libs/logger'
import encode from 'crypto-js/enc-hex'
import { getOne } from '../utils/crud'
import config from '../configs/app.config'
import { decodeCredential } from '../utils/common'
import { ERROR_MSG } from '../utils/constants/errors'
import getSymbolFromCurrency from 'currency-symbol-map'
import { EMAIL_DYNAMIC_OPTIONS, EMAIL_TEMPLATE_PRIMARY_STATUS, EMAIL_TEMPLATE_TYPES } from '../utils/constants/constant'

const mailjet = require('node-mailjet')

export async function sendEmailMailjet ({ emailTemplate, email, name, subject }) {
  const mailjetConfig = config.getProperties().mailjetConfig

  const sendEmailObj = {
    from: {
      Email: mailjetConfig.senderEmail,
      Name: mailjetConfig.senderName
    },
    To: [
      {
        Email: email,
        Name: name
      }
    ]
  }

  sendEmailObj.Subject = subject || 'Test Email'
  sendEmailObj.TextPart = 'Your Test Email'
  sendEmailObj.HTMLPart = emailTemplate

  const mailjet2 = mailjet.apiConnect(mailjetConfig.publicApiKey, mailjetConfig.privateApiKey)
  try {
    const request = await mailjet2
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [sendEmailObj]
      })

    if (request.response.status === 200) {
      return { success: true, code: request.response.status }
    } else {
      return { success: false, code: request.response.status }
    }
  } catch (error) {
    logger.error('VerificationMail', { message: 'Mailjet Error: Failed to send mail', exception: error })
    return { success: false, code: error?.code }
  }
}

export const sendMail = async ({ user, credentials, dataValues, templateId, successMsg }) => {
  sgMail.setApiKey(credentials.apiKey)

  const msg = {
    to: user.email,
    from: credentials.apiEmail,
    templateId,
    dynamic_template_data: dataValues
  }

  try {
    await sgMail.send(msg)
    return { success: true, message: successMsg }
  } catch {
    return { success: false, message: ERROR_MSG.SENDGRID_ERROR }
  }
}

export const sendMailRaw = async ({ email, credentials, dataValues, templateCode, successMsg }) => {
  if (Object.keys(credentials).length !== 2) return { success: false, message: ERROR_MSG.SENDGRID_CREDENTIALS }

  sgMail.setApiKey(credentials.apiKey)

  const msg = {
    to: email,
    from: credentials.apiEmail,
    subject: dataValues?.subject || 'Default Subject',
    text: dataValues?.subject || 'Default Subject',
    html: templateCode
  }

  try {
    await sgMail.send(msg)
    return { success: true, message: successMsg }
  } catch {
    return { success: false, message: ERROR_MSG.SENDGRID_ERROR }
  }
}

export const sendDynamicMail = async ({ user, credentials, subject, successMsg, dynamicEmail, senderName }) => {
  sgMail.setApiKey(credentials.apiKey)

  const msg = {
    to: user.email,
    from: {
      name: senderName || 'moneyFactory',
      email: credentials.apiEmail
    },
    subject,
    text: subject,
    html: dynamicEmail
  }

  try {
    await sgMail.send(msg)
    return { success: true, message: successMsg }
  } catch {
    return { success: false, message: ERROR_MSG.SENDGRID_ERROR }
  }
}

export const getSendGridCredentials = async () => {
  const credentials = {}
  const adminCredentials = await db.GlobalSetting.findAll({
    attributes: ['key', 'value'],
    where: { key: ['SENDGRID_API_KEY', 'SENDGRID_EMAIL'] },
    raw: true
  })
  adminCredentials.forEach(credential => {
    if (credential.key === 'SENDGRID_API_KEY') credentials.apiKey = decodeCredential(credential.value)
    if (credential.key === 'SENDGRID_EMAIL') credentials.apiEmail = decodeCredential(credential.value)
  })

  return credentials
}

export const convertToCsv = ({ fields, data }) => {
  const json2csv = new Parser({ fields })
  const csv = json2csv.parse(data)
  return csv
}

export const getCsvFileName = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.csv'
}

export const getXlsFileName = () => {
  return `Language_Sheet_${new Date().toISOString().substring(0, 10)}` + '.xls'
}

export const createEmailTemplateData = (data) => {
  if (data.length === 0) return {}
  const returnObject = {}

  data.forEach(template => {
    if (!returnObject[EMAIL_TEMPLATE_TYPES.INT_TO_VALUE[template.type]]) returnObject[EMAIL_TEMPLATE_TYPES.INT_TO_VALUE[template.type]] = []
    returnObject[EMAIL_TEMPLATE_TYPES.INT_TO_VALUE[template.type]].push(template)
  })

  return returnObject
}

export const insertDynamicDataInTemplate = ({ template, dynamicData }) => {
  let returnEmail = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
    returnEmail = returnEmail.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnEmail
}

export const getEmailDynamicKeys = () => {
  const returnList = []
  EMAIL_DYNAMIC_OPTIONS.forEach(option => {
    returnList.push(option.key)
  })
  return returnList
}

export const getDynamicData = async ({ userId, currentDataList }) => {
  const origin = (await getOne({ model: db.GlobalSetting, data: { key: 'ORIGIN' } })).value
  const siteName = (await getOne({ model: db.GlobalSetting, data: { key: 'SITE_NAME' } })).value
  const logoUrl = (await getOne({ model: db.GlobalSetting, data: { key: 'LOGO_URL' } })).value

  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [
      { model: db.Wallet, as: 'userWallet' }
    ]
  })

  const dynamicData = {
    siteName,
    siteLogo: logoUrl,
    siteUrl: origin,
    playerEmail: userDetails.email,
    playerFullName: userDetails.firstName + ' ' + userDetails.lastName,
    playerFirstName: userDetails.firstName,
    playerLastName: userDetails.lastName,
    userName: userDetails.username,
    siteLoginUrl: `${origin}/login`,
    sendSupportRequestRoute: `${origin}}/support-mail`,
    playerCurrencySymbol: getSymbolFromCurrency(userDetails.currencyCode),
    subject: '-',
    reason: '-',
    link: '-',
    withdrawAmount: '-',
    depositAmount: '-',
    transactionId: '-',
    supportEmailAddress: '-',
    kycLabels: '-'
  }

  return { ...dynamicData, ...currentDataList }
}

export const createEmailWithDynamicValues = async ({ emailType, userId, serviceData, language }) => {
  let dynamicData = { ...serviceData }

  let templateDetails = await db.EmailTemplate.findOne({
    where: { type: emailType, isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY },
    raw: true
  })

  if (!templateDetails) {
    templateDetails = await db.EmailTemplate.findOne({
      where: { isDefault: true, type: emailType },
      raw: true
    })
  }

  dynamicData = {
    ...await getDynamicData({ userId, dataList: templateDetails.dynamicData, currentDataList: dynamicData })
  }

  const emailData = insertDynamicDataInTemplate({ template: templateDetails.templateCode[language] || templateDetails.templateCode.EN, dynamicData })

  return emailData
}

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode)
}

export const liveUpdateWallet = async ({ userId, userUuid, cash, nonCash, wagering, wageredAmount, level, loyaltyPoints, amountToWager, wageringStatus }) => {
  try {
    const updateWalletURL = `${config.get('userBackendAddress')}/api/user/live-update-wallet`
    const payload = { userId, userUuid, cash, nonCash, wagering, wageredAmount, level, loyaltyPoints, wageringStatus, amountToWager }
    const token = secureData({ data: payload, key: config.get('microService.accessToken') })

    const response = await axios.post(updateWalletURL, payload, {
      headers: { 'MICRO-SERVICE-REQUEST-SIGN': token }
    })

    if (response.data.success) return true
    return false
  } catch {
    return false
  }
}

export const setEmailKeyDescription = (EmailKeysList) => {
  const returnObject = {}

  EmailKeysList.forEach((dynamicKey) => {
    returnObject[dynamicKey.key] = dynamicKey.description
  })

  return returnObject
}

export async function sendCsvByEmailMailjet ({ email, name, subject, textPart, fileName, data }) {
  const base64Data = Buffer.from(data).toString('base64')
  const mailjetConfig = config.getProperties().mailjetConfig

  const sendEmailObj = {
    from: {
      Email: mailjetConfig.senderEmail,
      Name: mailjetConfig.senderName
    },
    To: [
      {
        Email: `${email}`,
        Name: `${name}`
      }
    ]
  }

  sendEmailObj.Subject = `${subject}`
  sendEmailObj.TextPart = `${textPart}`
  sendEmailObj.Attachments = [
    {
      ContentType: 'csv',
      Filename: `${fileName}`,
      Base64Content: `${base64Data}`
    }
  ]

  const mailjet2 = mailjet.apiConnect(mailjetConfig.publicApiKey, mailjetConfig.privateApiKey)
  try {
    const request = await mailjet2
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [sendEmailObj]
      })
    if (request.response.status === 200) {
      return { success: true, code: request.response.status }
    } else {
      return { success: false, code: request.response.status }
    }
  } catch (error) {
    Logger.error('VerificationMail', { message: 'Mailjet Error: Failed to send mail', exception: error })
    return { success: false, code: error?.code }
  }
}