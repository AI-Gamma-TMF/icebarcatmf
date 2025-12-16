import { QueryTypes } from 'sequelize'
import db, { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, exportCenterAxiosCall, calculateUTCDateRangeForTimezoneRange } from '../../utils/common'
import { TRANSACTION_STATUS, CSV_TYPE } from '../../utils/constants/constant'

export class GetTransactionsService extends ServiceBase {
  async run () {
    let { pageNo, limit, orderBy, sort, startDate, endDate, transactionType, email, status, userId, timezone, csvDownload } = this.args
    let where = '1 = 1'
    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (startDate || endDate) {
        const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
        startDate = result?.startDateUTC
        endDate = result?.endDateUTC
      }
      where = `("createdAt" >= '${startDate}' AND "createdAt" <= '${endDate}')`

      if (status && status !== 'all') { where += ` AND "status" = ${TRANSACTION_STATUS[status.toUpperCase()]}` }
      if (email) where += ` AND "actioneeEmail" iLIKE '%${email}%'`
      if (userId) where += ` AND "userId" = ${userId}`
      if (transactionType && transactionType !== 'all') {
        if (transactionType === 'deposit') transactionType = 'Purchase' // As we are assigning "Purchase" in place of "deposit".
        where += ` AND "transactionType" = '${transactionType}'`
      }
      let exportId = null
      let exportType = null
      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          // Adding a table in Db called export center
          const exportTbl = await db.ExportCenter.create(
            { type: CSV_TYPE.TRANSACTION_BANKING_CSV, adminUserId: id, payload: this.args },
            { transaction }
          )
          exportId = exportTbl.dataValues.id
          exportType = exportTbl.dataValues.type

          const axiosBody = {
            limit: limit || 15,
            pageNo: pageNo || 1,
            orderBy: orderBy || '',
            sort: sort || '',
            startDate: startDate,
            endDate: endDate,
            transactionType: transactionType,
            email: email,
            status: status,
            userId: userId || '',
            timezone: timezone,
            csvDownload: csvDownload || '',
            exportId: exportId,
            exportType: exportType,
            type: CSV_TYPE.TRANSACTION_BANKING_CSV
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
      const transactionDetail = await this.fetchData({ where, orderBy, sort, limit: size, offset: (page - 1) * size })
      const totalCount = transactionDetail[0]?.count
      return {
        transactionDetail: {
          count: +totalCount,
          rows: transactionDetail
        },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ where, orderBy, sort, limit, offset }) {
    const query = `
        SELECT
    *,
    (
      SELECT
        COUNT(*)
      FROM
        (
          SELECT
            actionee_id AS "userId",
            transaction_id :: varchar as "transactionId",
            actionee_email as "actioneeEmail",
            amount as "amount",
            gc_coin as "gcCoin",
            sc_coin as "scCoin",
            (CASE WHEN transaction_type = 'deposit' THEN 'Purchase' ELSE transaction_type END) as "transactionType",
            status as "status",
            promocode_id AS "promocodeId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM
            public.transaction_bankings
          WHERE
            transaction_type NOT IN ('redeem')
          UNION
          SELECT
            user_id as "userId",
            transaction_id :: varchar as "transactionId",
            email as "actioneeEmail",
            amount as "amount",
            0 as "gcCoin",
            amount as "scCoin",
            'redeem' as "transactionType",
            status as "status",
            NULL AS "promocodeId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM
            public.withdraw_requests
        ) AS subQuery
        WHERE ${where}
    ) AS count
    FROM
    (
      SELECT
        actionee_id AS "userId",
        transaction_id :: varchar as "transactionId",
        actionee_email as "actioneeEmail",
        amount as "amount",
        ROUND(CAST(SUM(COALESCE(gc_coin, 0) + COALESCE(bonus_gc, 0) + COALESCE(promocode_bonus_gc, 0)) AS numeric), 2) AS "gcCoin",
        ROUND(CAST(SUM(COALESCE(sc_coin, 0) + COALESCE(bonus_sc, 0) + COALESCE(promocode_bonus_sc, 0)) AS numeric), 2) AS "scCoin", 
        (CASE WHEN transaction_type = 'deposit' THEN 'Purchase' ELSE transaction_type END) as "transactionType",
        status as "status",
        promocode_id AS "promocodeId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        more_details AS "moreDetails"
      FROM
        public.transaction_bankings
      WHERE
        transaction_type NOT IN ('redeem')
      GROUP BY transaction_id, actionee_id, actionee_email, promocode_id, transaction_type, status, created_at, updated_at, amount, more_details
      UNION
      SELECT
        user_id as "userId",
        transaction_id :: varchar as "transactionId",
        email as "actioneeEmail",
        amount as "amount",
        0 as "gcCoin",
        amount as "scCoin",
        'redeem' as "transactionType",
        status as "status",
        NULL AS "promocodeId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        more_details AS "moreDetails"
      FROM
        public.withdraw_requests
    ) AS subQuery
    WHERE ${where}
    ORDER BY "${orderBy || 'createdAt'}" ${sort || 'DESC'}
    LIMIT
    :limit OFFSET :offset`

    const transactionDetail = await sequelize.query(query, {
      replacements: {
        limit,
        offset
      },
      type: QueryTypes.SELECT
    })

    return transactionDetail
  }
}
