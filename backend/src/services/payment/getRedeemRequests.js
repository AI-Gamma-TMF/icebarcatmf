import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import redisClient from '../../libs/redisClient'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TRANSACTION_STATUS, CSV_TYPE } from '../../utils/constants/constant'
import { pageValidation, exportCenterAxiosCall, calculateUTCDateRangeForTimezoneRange } from '../../utils/common'

export class GetRedeemRequestsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ExportCenter: ExportCenterModel
      }
    } = this.context

    const { id: adminUserId, pageNo, limit, transactionId, orderBy, sortBy, email, status, userId, csvDownload, operator, filterBy, value, timezone, paymentProvider } = this.args
    let { startDate, endDate } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    if (startDate || endDate) {
      const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
      startDate = result?.startDateUTC
      endDate = result?.endDateUTC
    }

    let whereQuery = 'WHERE 1 = 1'
    if (userId) whereQuery += ` AND wr.user_id = ${userId}`
    if (transactionId) whereQuery += ` AND wr.transaction_id = '${transactionId}'`
    if (status && status !== 'all') whereQuery += ` AND wr.status = ${TRANSACTION_STATUS[status.toUpperCase()]}`
    if (email) whereQuery += ` AND wr.email = '${email}'`
    if (paymentProvider && paymentProvider !== 'all') whereQuery += ` AND wr.payment_provider = '${paymentProvider}'`
    if (startDate && endDate) whereQuery += ` AND wr.created_at BETWEEN '${startDate}' AND '${endDate}'`

    switch (filterBy) {
      case 'NGR':
        whereQuery += ` AND ROUND(COALESCE(ur.total_purchase_amount, 0) - (COALESCE(ur.total_redemption_amount, 0) + COALESCE(ur.total_pending_redemption_amount, 0) + COALESCE(CAST(w.sc_coin ->> 'bsc' AS NUMERIC), 0) +  COALESCE(CAST(w.sc_coin ->> 'psc' AS NUMERIC), 0) +  COALESCE(CAST(w.sc_coin ->> 'wsc' AS NUMERIC), 0) +  COALESCE(CAST(w.vault_sc_coin ->> 'bsc' AS NUMERIC), 0) +  COALESCE(CAST(w.vault_sc_coin ->> 'psc' AS NUMERIC), 0) +  COALESCE(CAST(w.vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) ${operator} ${value}`
        break
      case 'playThrough':
        whereQuery += ` AND ROUND(COALESCE((ur.total_sc_bet_amount / NULLIF(ur.total_purchase_amount, 0)), 0) :: numeric, 2) ${operator} ${value}`
        break
      case 'amount':
        whereQuery += ` AND wr.amount ${operator} ${value}`
        break
      case 'last30daysRollingRedeemAmount':
        whereQuery += ` AND (SELECT SUM(amount) FROM transaction_bankings WHERE created_at BETWEEN :sumStartDate AND :sumEndDate AND actionee_id = wr.user_id AND transaction_type = 'redeem' AND status = '1') ${operator} ${value}`
        break
      default:
        break
    }

    let orderClauseBy = ''
    switch (orderBy) {
      case 'userId':
        orderClauseBy = 'wr.user_id'
        break
      case 'status':
        orderClauseBy = 'wr.status'
        break
      case 'withdrawRequestId':
        orderClauseBy = 'wr.withdraw_request_id'
        break
      case 'amount':
        orderClauseBy = 'wr.amount'
        break
      case 'transactionId':
        orderClauseBy = 'wr.transaction_id'
        break
      case 'email':
        orderClauseBy = 'wr.email'
        break
      case 'cancelRedemptionCount':
        orderClauseBy = 'ur.cancelled_redemption_count'
        break
      case 'lastWithdrawalDate':
        orderClauseBy = "(SELECT MAX(created_at) FROM transaction_bankings WHERE actionee_id = wr.user_id AND transaction_type = 'redeem' AND status = '1')"
        break
      case 'zipCode':
        orderClauseBy = 'users.zip_code'
        break
      case 'paymentProvider':
        orderClauseBy = 'wr.payment_provider'
        break
      case 'NGR':
        orderClauseBy = "ROUND(COALESCE(ur.total_purchase_amount, 0) - (COALESCE(ur.total_redemption_amount, 0) + COALESCE(ur.total_pending_redemption_amount, 0) + COALESCE(CAST(w.sc_coin ->> 'bsc' AS NUMERIC), 0) +  COALESCE(CAST(w.sc_coin ->> 'psc' AS NUMERIC), 0) +  COALESCE(CAST(w.sc_coin ->> 'wsc' AS NUMERIC), 0) + COALESCE(CAST(w.vault_sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(w.vault_sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(w.vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2)"
        break
      case 'playThrough':
        orderClauseBy = 'ROUND(COALESCE((ur.total_sc_bet_amount / NULLIF(ur.total_purchase_amount, 0)), 0) :: numeric, 2)'
        break
      case 'last30daysRollingRedeemAmount':
        orderClauseBy = "(SELECT SUM(amount) FROM transaction_bankings WHERE created_at BETWEEN :sumStartDate AND :sumEndDate AND actionee_id = wr.user_id AND transaction_type = 'redeem' AND status = '1')"
        break
      default:
        orderClauseBy = 'wr.created_at'
        break
    }

    const stateList = await this.getFloridaAndNewYorkStateId()

    if (csvDownload === 'true') {
      let exportId = null
      let exportType = null
      const transaction = await sequelize.transaction()
      try {
        // Adding a table in Db called export center
        const exportTbl = await ExportCenterModel.create(
          {
            type: CSV_TYPE.REDEEM_REQUEST_CSV,
            adminUserId: adminUserId,
            payload: this.args
          },
          { transaction }
        )
        exportId = exportTbl.dataValues.id
        exportType = exportTbl.dataValues.type

        const axiosBody = {
          orderBy: orderClauseBy,
          sortBy: sortBy,
          exportId: exportId,
          stateList: stateList,
          exportType: exportType,
          timezone: timezone,
          whereQuery: whereQuery,
          type: CSV_TYPE.REDEEM_REQUEST_CSV
        }
        // Hitting CSV Download API
        await exportCenterAxiosCall(axiosBody)
        await transaction.commit()
        return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
      } catch (error) {
        await transaction.rollback()
        return this.addError('InternalServerErrorType', error)
      }
    }

    const today = new Date()
    const sumEndDate = new Date()
    const sumStartDate = new Date(today.setDate(today.getDate() - 30))

    const [[{ totalCount }], withdrawRequestsData] = await Promise.all([
      sequelize.query(
        `
        SELECT
          COUNT(*) AS "totalCount"
        FROM withdraw_requests wr
        LEFT JOIN USER_REPORTS UR ON WR.USER_ID = UR.USER_ID
        LEFT JOIN users ON wr.user_id = users.user_id
        LEFT JOIN wallets w ON wr.user_id = w.owner_id
        ${whereQuery}
        LIMIT 1
      `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            sumStartDate,
            sumEndDate
          }
        }
      ),
      sequelize.query(
        `
        SELECT
          wr.user_id AS "userId",
          wr.status,
          wr.withdraw_request_id AS "withdrawRequestId",
          wr.amount AS "amount",
          wr.transaction_id AS "transactionId",
          wr.email AS "email",
          ur.cancelled_redemption_count AS "cancelRedemptionCount",
          (SELECT MAX(created_at) FROM transaction_bankings WHERE actionee_id = wr.user_id AND transaction_type = 'redeem' AND status = '1') AS "lastWithdrawalDate",
          (SELECT SUM(amount) FROM transaction_bankings WHERE created_at BETWEEN :sumStartDate AND :sumEndDate AND actionee_id = wr.user_id AND transaction_type = 'redeem' AND status = '1') AS "last30daysRollingRedeemAmount",
          users.zip_code AS "zipCode",
          wr.more_details->>'ipAddress' AS "ipLocation",
          actionable_email AS "actionableEmail",
          (CASE WHEN NULLIF(users.state, '') :: INTEGER IN (${stateList}) THEN true ELSE false END) AS "isFloridaOrNewYorkUser",
          wr.payment_provider AS "paymentProvider",
          ROUND(COALESCE(ur.total_purchase_amount, 0) -
            (COALESCE(ur.total_redemption_amount, 0) +
            COALESCE(ur.total_pending_redemption_amount, 0) +
            COALESCE(CAST(w.sc_coin ->> 'bsc' AS NUMERIC), 0) + 
            COALESCE(CAST(w.sc_coin ->> 'psc' AS NUMERIC), 0) + 
            COALESCE(CAST(w.sc_coin ->> 'wsc' AS NUMERIC), 0) + 
            COALESCE(CAST(w.vault_sc_coin ->> 'bsc' AS NUMERIC), 0) + 
            COALESCE(CAST(w.vault_sc_coin ->> 'psc' AS NUMERIC), 0) + 
            COALESCE(CAST(w.vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) AS "NGR",
          ROUND(COALESCE((ur.total_sc_bet_amount / NULLIF(ur.total_purchase_amount, 0)), 0) :: numeric, 2) AS "playThrough"
        FROM
          WITHDRAW_REQUESTS WR
        LEFT JOIN USER_REPORTS UR ON WR.USER_ID = UR.USER_ID
        LEFT JOIN users ON wr.user_id = users.user_id
        LEFT JOIN wallets w ON wr.user_id = w.owner_id
        ${whereQuery}
        ORDER BY ${orderClauseBy} ${sortBy || 'DESC'}
        LIMIT ${size} OFFSET ${(page - 1) * size};
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            sumStartDate,
            sumEndDate
          }
        }
      )
    ])

    return {
      message: SUCCESS_MSG.GET_SUCCESS,
      requestDetails: {
        count: +totalCount,
        rows: withdrawRequestsData
      }
    }
  }

  async getFloridaAndNewYorkStateId () {
    const {
      dbModels: {
        State: StateModel
      }
    } = this.context
    let stateRedisData = await redisClient.client.get('stateData')

    if (!stateRedisData) {
      const state = await StateModel.findAll({
        attributes: ['name', 'stateCode', 'state_id'],
        raw: true
      })

      await redisClient.client.set('stateData', JSON.stringify(state))
      stateRedisData = JSON.stringify(state)
    }
    stateRedisData = JSON.parse(stateRedisData)

    const filteredStates = stateRedisData.filter(state => (state.name === 'Florida' && state.stateCode === 'FL') || (state.name === 'New York' && state.stateCode === 'NY'))

    const stateList = filteredStates.map(item => item.state_id)

    return stateList
  }
}
