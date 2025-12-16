import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'

export class GetExpiredCrmBonusService extends ServiceBase {
  async run () {
    const { promocode, status, pageNo, limit, filterBy, filterOperator, filterValue } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    const pagination = `LIMIT ${size} OFFSET ${(page - 1) * size}`

    let where = `crm_promocode = false AND deleted_at IS NULL AND promocode = '${promocode}'`

    if (filterBy && filterOperator && filterValue !== undefined) {
      switch (filterBy) {
        case 'claimedCount':
          where += ` AND user_bonus_agg.claimed_count ${filterOperator} ${filterValue}`
          break
        case 'claimedScAmount':
          where += ` AND user_bonus_agg.claimed_sc ${filterOperator} ${filterValue}`
          break
        case 'claimedGcAmount':
          where += ` AND user_bonus_agg.claimed_gc ${filterOperator} ${filterValue}`
          break
        case 'pendingCount':
          where += ` AND user_bonus_agg.pending_count ${filterOperator} ${filterValue}`
          break
        case 'pendingScAmount':
          where += ` AND user_bonus_agg.pending_sc ${filterOperator} ${filterValue}`
          break
        case 'pendingGcAmount':
          where += ` AND user_bonus_agg.pending_gc ${filterOperator} ${filterValue}`
          break
        default:
          break
      }
    }

    if (status && status !== 'all' && [PROMOCODE_STATUS.UPCOMING, PROMOCODE_STATUS.ACTIVE, PROMOCODE_STATUS.EXPIRED, PROMOCODE_STATUS.DELETED].includes(+status)) where += ` AND status = ${status}`

    const [[{ count }], rows] = await Promise.all([
      sequelize.query(
        `SELECT COUNT(*) AS count FROM crm_promotions WHERE ${where}`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `WITH user_bonus_agg AS (
          SELECT
            promocode_id,
            COUNT(*) FILTER (WHERE status = 'CLAIMED') AS claimed_count,
            SUM(sc_amount) FILTER (WHERE status = 'CLAIMED') AS claimed_sc,
            SUM(gc_amount) FILTER (WHERE status = 'CLAIMED') AS claimed_gc,
            COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_count,
            SUM(sc_amount) FILTER (WHERE status = 'PENDING') AS pending_sc,
            SUM(gc_amount) FILTER (WHERE status = 'PENDING') AS pending_gc
          FROM user_bonus
          WHERE bonus_type = 'promotion-bonus'
          GROUP BY promocode_id
        )
        SELECT
          CRM_PROMOTIONS.CRM_PROMOTION_ID AS "crmPromotionId",
          CRM_PROMOTIONS.PROMOCODE,
          CRM_PROMOTIONS.NAME,
          CRM_PROMOTIONS.CAMPAIGN_ID AS "campaignId",
          CRM_PROMOTIONS.STATUS,
          CRM_PROMOTIONS.SC_AMOUNT AS "scBonus",
          CRM_PROMOTIONS.GC_AMOUNT AS "gcBonus",
          CRM_PROMOTIONS.VALID_FROM AS "startDate",
          CRM_PROMOTIONS.EXPIRE_AT AS "endDate",
          COALESCE(user_bonus_agg.claimed_count, 0) AS "claimedCount",
          COALESCE(user_bonus_agg.claimed_sc, 0) AS "claimedScAmount",
          COALESCE(user_bonus_agg.claimed_gc, 0) AS "claimedGcAmount",
          COALESCE(user_bonus_agg.pending_count, 0) AS "pendingCount",
          COALESCE(user_bonus_agg.pending_sc, 0) AS "pendingScAmount",
          COALESCE(user_bonus_agg.pending_gc, 0) AS "pendingGcAmount"
        FROM
          CRM_PROMOTIONS
          LEFT JOIN user_bonus_agg
            ON user_bonus_agg.promocode_id = CRM_PROMOTIONS.crm_promotion_id
        WHERE ${where}
        ORDER BY CRM_PROMOTIONS.EXPIRE_AT NULLS FIRST
        ${pagination};`,
        { type: sequelize.QueryTypes.SELECT, logging: true }
      )
    ])

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      data: { count, rows }
    }
  }
}
