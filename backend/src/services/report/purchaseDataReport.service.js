import ServiceBase from '../../libs/serviceBase'
import { CSV_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { exportCenterAxiosCall, pageValidation } from '../../utils/common'

export class PurchaseDataReportService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ExportCenter: ExportCenterModel
      },
      sequelize
    } = this.context
    const { search, filterBy, filterOperator, filterValue, limit, pageNo, csvDownload, sortBy, orderBy, timezone } = this.args

    let whereClause = ''

    if (search) whereClause = ` AND (u.user_id = ${+search || null} OR u.username = '${search}'::VARCHAR OR u.email = '${search}'::VARCHAR)`

    const { page, size } = pageValidation(pageNo, limit)

    switch (filterBy) {
      case 'purchase':
        whereClause += ` AND ROUND(COALESCE(ur.total_purchase_amount, 0), 2) ${filterOperator} ${filterValue}`
        break
      case 'redeem':
        whereClause += ` AND ROUND(COALESCE(ur.total_redemption_amount, 0), 2) ${filterOperator} ${filterValue}`
        break
      case 'play':
        whereClause += ` AND ROUND(COALESCE(ur.total_sc_bet_amount, 0), 2) ${filterOperator} ${filterValue}`
        break
      case 'balance':
        whereClause += ` AND ROUND(COALESCE(bal.total_balance, 0), 2) ${filterOperator} ${filterValue}`
        break
      case 'win':
        whereClause += ` AND ROUND(COALESCE(ur.total_sc_win_amount, 0), 2) ${filterOperator} ${filterValue}`
        break
      case 'ngr':
        whereClause += ` AND ROUND(COALESCE(COALESCE(ur.total_purchase_amount, 0) - (COALESCE(ur.total_redemption_amount, 0) + COALESCE(ur.total_redemption_amount, 0) + COALESCE(bal.total_balance, 0))) :: numeric, 2) ${filterOperator} ${filterValue}`
        break
      case 'ggr':
        whereClause += ` AND ROUND(COALESCE(COALESCE(ur.total_sc_bet_amount, 0) - COALESCE(ur.total_sc_win_amount, 0)) :: numeric, 2) ${filterOperator} ${filterValue}`
        break
      case 'playThrough':
        whereClause += ` AND CASE WHEN ur.total_purchase_amount = 0 THEN 0 ELSE ROUND(COALESCE(COALESCE(ur.total_sc_bet_amount, 0) / COALESCE(ur.total_purchase_amount, 0)) :: numeric, 2) END ${filterOperator} ${filterValue}`
        break
      case 'totalPendingRedemptionAmount':
        whereClause += ` AND ROUND(COALESCE(ur.total_pending_redemption_amount, 0), 2) ${filterOperator} ${filterValue}`
        break
      default:
        whereClause += ' AND ROUND(COALESCE(ur.total_purchase_amount, 0), 2) > 0'
        break
    }

    const countQuery = `
    WITH BALANCE AS (
      SELECT
        owner_id AS user_id,
        ROUND(SUM(COALESCE(CAST(sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) + ROUND(SUM(COALESCE(CAST(vault_sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) AS total_balance
      FROM
        wallets
      GROUP BY owner_id
    )
    SELECT
        COUNT(*) AS count
      FROM
        user_reports ur
      INNER JOIN users u ON u.user_id = ur.user_id
      LEFT JOIN balance bal ON bal.user_id = u.user_id
      WHERE
        u.is_internal_user = FALSE ${whereClause}`

    const query = `
    WITH BALANCE AS (
      SELECT
        owner_id AS user_id,
        ROUND(SUM(COALESCE(CAST(sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) + ROUND(SUM(COALESCE(CAST(vault_sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) AS total_balance
      FROM
        wallets
      GROUP BY owner_id
    )
      SELECT
        ur.user_id AS "userId",
        u.email,
        u.username,
        ROUND(ur.total_purchase_amount :: numeric, 2) AS purchase,
        ROUND((ur.total_redemption_amount)::numeric, 2) AS redeem,
        ROUND(bal.total_balance :: numeric, 2) AS balance,
        ur.total_sc_bet_amount AS play,
        ur.total_sc_win_amount AS win,
        ROUND(COALESCE(COALESCE(ur.total_purchase_amount, 0) - (COALESCE(ur.total_pending_redemption_amount, 0) + COALESCE(ur.total_redemption_amount, 0) + COALESCE(bal.total_balance, 0))) :: numeric, 2) AS "NGR",
        CASE WHEN ur.total_purchase_amount = 0 THEN 0 ELSE ROUND(COALESCE(COALESCE(ur.total_sc_bet_amount, 0) / COALESCE(ur.total_purchase_amount, 0)) :: numeric, 2) END AS "playThrough",
        ROUND(COALESCE(COALESCE(ur.total_sc_bet_amount, 0) - COALESCE(ur.total_sc_win_amount, 0)) :: numeric, 2) AS "GGR",
        COALESCE(ur.cancelled_redemption_count, 0) AS "cancelledRedemptionCount",
        COALESCE(ur.redemption_count + ur.cancelled_redemption_count + ur.pending_redemption_count, 0) AS "totalRedemptionCount",
        COALESCE(ur.purchase_count, 0) AS "totalPurchaseCount",
        COALESCE(ur.total_pending_redemption_amount) AS "totalPendingRedemptionAmount",
        COALESCE(ur.pending_redemption_count, 0) AS "pendingRedemptionCount",
        COALESCE(ur.redemption_count, 0) AS "completedRedemptionCount",
        (CASE WHEN u.is_ban = TRUE OR u.is_Active = false OR u.is_restrict = TRUE THEN TRUE ELSE false END) AS "disabledUser",
        u.last_login_date AS "lastLoginDate",
        u.created_at AS "registrationDate",
        u.affiliate_id AS "affiliateId"
      FROM
        user_reports ur
      INNER JOIN users u ON u.user_id = ur.user_id
      LEFT JOIN balance bal ON bal.user_id = u.user_id
      WHERE
        u.is_internal_user = FALSE ${whereClause}
      ORDER BY
        "${orderBy || 'userId'}" ${sortBy || 'ASC'}
      LIMIT :limit
      OFFSET :offset
      `

    if (csvDownload === 'true') {
      const transaction = await sequelize.transaction()
      try {
        const { id } = this.context.req.body

        const exportTbl = await ExportCenterModel.create({ type: CSV_TYPE.PURCHASE_REPORT_CSV, adminUserId: id, payload: query }, { transaction })

        const axiosBody = {
          exportId: exportTbl.id,
          exportType: exportTbl.type,
          query,
          timezone,
          type: CSV_TYPE.PURCHASE_REPORT_CSV
        }

        await exportCenterAxiosCall(axiosBody)

        await transaction.commit()
        return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
      } catch (error) {
        await transaction.rollback()
        return this.addError('InternalServerErrorType', error)
      }
    }

    const [[{ count }], data] = await Promise.all([
      sequelize.query(countQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(query, { type: sequelize.QueryTypes.SELECT, replacements: { limit: size, offset: (page - 1) * size } })
    ])

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      data: {
        count: +count,
        rows: data
      }
    }
  }
}
