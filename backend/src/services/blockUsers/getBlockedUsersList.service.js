import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { pageValidation, calculateNGR, exportCenterAxiosCall } from '../../utils/common'
import { Op } from 'sequelize'
import db, { Sequelize, sequelize } from '../../db/models'
import { CSV_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    phoneSearch: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    csvDownload: { type: ['string', 'null'] },
    tierSearch: { type: ['string', 'null'] },
    unifiedSearch: { type: ['string', 'null', 'number'] },
    promocodeStatus: {
      anyOf: [
        { type: 'boolean' },
        { type: 'string', enum: ['all'] },
        { type: 'null' }
      ]
    }

  }
}
const constraints = ajv.compile(schema)

export class GetBlockedUsersList extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, phoneSearch, orderBy, sort, csvDownload, tierSearch, unifiedSearch, promocodeStatus } = this.args

    try {
      let query

      const { page, size } = pageValidation(pageNo, limit)
      if (unifiedSearch) {
        if (/^\d+$/.test(unifiedSearch)) {
          query = { ...query, userId: +unifiedSearch }
        } else {
          query = {
            ...query,
            [Op.or]: [
              { username: { [Op.iLike]: `%${unifiedSearch}%` } },
              { firstName: { [Op.iLike]: `%${unifiedSearch}%` } },
              { lastName: { [Op.iLike]: `%${unifiedSearch}%` } },
              { email: { [Op.iLike]: `%${unifiedSearch}%` } }
            ]
          }
        }
      }

      if (phoneSearch) query = { ...query, phone: { [Op.iLike]: `%${phoneSearch}%` } }
      if (tierSearch) query = { level: +tierSearch }

      let searchAllUsers = true
      if (unifiedSearch || phoneSearch) searchAllUsers = false

      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          const exportTbl = await db.ExportCenter.create({ type: CSV_TYPE.PROMOCODE_BLOCKED_USERS_CSV, adminUserId: id, payload: this.args }, { transaction })

          const axiosBody = { orderBy, sort, phoneSearch, tierSearch, unifiedSearch, promocodeStatus, exportId: exportTbl.dataValues.id, exportType: exportTbl.dataValues.type, type: CSV_TYPE.PROMOCODE_BLOCKED_USERS_CSV, searchAllUsers }

          await exportCenterAxiosCall(axiosBody)
          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      const blockedUsersData = await this.fetchData({ query, promocodeStatus, size, offset: (page - 1) * size, sort, orderBy, searchAllUsers })

      return { message: SUCCESS_MSG.GET_SUCCESS, blockedUsersData }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ query, promocodeStatus, size, offset, sort, orderBy, searchAllUsers = true }) {
    const {
      dbModels: {
        User: UserModel,
        BlockedUsers: BlockedUsersModel
      }
    } = this.context

    let order
    if (orderBy === 'isAvailPromocodeBlocked') {
      order = [[Sequelize.col('"blockedUsers.is_avail_promocode_blocked"'), sort || 'DESC']]
    } else {
      order = [[orderBy || 'createdAt', sort || 'DESC']]
    }

    const includeBlockedUsers = {
      model: BlockedUsersModel,
      as: 'blockedUsers',
      required: promocodeStatus !== 'all' || searchAllUsers,
      attributes: []
    }

    if (promocodeStatus !== 'all') {
      includeBlockedUsers.where = {
        isAvailPromocodeBlocked: promocodeStatus
      }
    }
    const data = await UserModel.findAndCountAll({
      where: query,
      order: order,
      limit: size,
      offset,
      attributes: [
        [Sequelize.col('blockedUsers.is_avail_promocode_blocked'), 'isAvailPromocodeBlocked'],
        'userId',
        'email',
        'firstName',
        'isActive',
        'kycStatus',
        'lastName',
        'username',
        'kycApplicantId',
        'createdAt',
        'currencyCode',
        'countryCode',
        'lastLoginDate',
        'authUrl',
        'authEnable',
        'isBan',
        'isRestrict',
        'isInternalUser',
        'reasonId'
      ],
      include: [includeBlockedUsers]
    })
    // only add NGR if user is searched extensively
    if (!searchAllUsers) {
      // Adding NGR for each user
      const rowsWithNGR = await Promise.all(data.rows.map(async (user) => {
        const ngr = await calculateNGR(user.userId) // Calculating NGR using external function
        return {
          ...user.dataValues, // Including all original attributes
          NGR: ngr // Adding the calculated NGR
        }
      }))
      return { rows: rowsWithNGR, count: data.count }
    }
    return { rows: data.rows, count: data.count }
  }
}
