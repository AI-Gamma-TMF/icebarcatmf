import ServiceBase from '../../../libs/serviceBase'
import { pageValidation, calculateDate } from '../../../utils/common'
import { QueryTypes } from 'sequelize'
import { sequelize } from '../../../db/models'
import { BONUS_TYPE } from '../../../utils/constants/constant'
export class ScratchCardBonusDetailsReportService extends ServiceBase {
  async run () {
    const { startDate, endDate, scratchCardId = ['all'], timezone, pageNo, limit, search, idSearch } = this.args
    const result = calculateDate(endDate, startDate, timezone)
    try {
      const { page, size } = pageValidation(pageNo, limit)
      let whereClause = '1 = 1'
      let where = ''
      const replacements = {
        startDate: result.startDate,
        endDate: result.endDate,
        bonusType: BONUS_TYPE.SCRATCH_CARD_BONUS,
        offset: (page - 1) * size,
        limit: size
      }

      if (search) {
        whereClause += ' AND (u.username ILIKE :search OR u.email ILIKE :search)'
        replacements.search = `%${search}%`
      }

      if (idSearch) {
        whereClause += ' AND u.user_id::text = :idSearch'
        replacements.idSearch = idSearch
      }

      const groupByFields = 'u.user_id, u.email, u.username, ct.more_details->>\'scratchCardId\''
      const orderByFields = 'u.user_id ASC, scratch_card_id ASC'

      if (!scratchCardId.includes('all')) {
        whereClause += ` AND (ct.more_details->>'scratchCardId')::int = ANY(ARRAY[${scratchCardId}])` // where condition of scratch card for casino transactions table
        where = `AND ub.scratch_card_id = ANY(ARRAY[${scratchCardId}])` // Where condition for userbonus table for gc and sc pending count
        replacements.scratchCardId = scratchCardId
      }

      // Count Query
      const [{ count = 0 }] = await sequelize.query(
          `SELECT COUNT(*) AS "count" FROM (
            SELECT 1
            FROM users u
            JOIN public.casino_transactions ct 
              ON u.user_id = ct.user_id
              AND ct.created_at BETWEEN :startDate AND :endDate
              AND ct.action_id = '1'
              AND ct.action_type = :bonusType
              AND ct.status = 1
            WHERE ${whereClause}
            GROUP BY ${groupByFields}
          ) AS sub`,
          {
            type: QueryTypes.SELECT,
            replacements
          }
      )

      // Main Query
      const response = await sequelize.query(
          `SELECT 
              u.user_id,
              u.email,
              u.username,
              CAST(COUNT(*) AS INTEGER) AS total_claimed_count,
              CAST(SUM(CASE WHEN (ct.more_details->>'scratchCardRewardType') = 'SC' THEN (ct.more_details->>'scratchCardBonus')::double precision ELSE 0 END) AS NUMERIC) AS total_sc_bonus_claimed,
              CAST(SUM(CASE WHEN (ct.more_details->>'scratchCardRewardType') = 'GC' THEN (ct.more_details->>'scratchCardBonus')::double precision ELSE 0 END) AS NUMERIC) AS total_gc_bonus_claimed,
              -- GC bonuses still pending to be claimed from user_bonus
                ROUND((
                    SELECT COALESCE(SUM(ub.sc_amount::numeric), 0)
                    FROM public.user_bonus ub
                    WHERE 
                        ub.user_id = u.user_id
                        AND ub.status = 'PENDING'
                        AND ub.bonus_type = 'scratch-card-bonus'
                        ${where}
                ), 2)::DOUBLE PRECISION AS pending_to_claim_sc_bonus,
                 ROUND((
                    SELECT COALESCE(SUM(ub.gc_amount::numeric), 0)
                    FROM public.user_bonus ub
                    WHERE 
                        ub.user_id = u.user_id
                        AND ub.status = 'PENDING'
                        AND ub.bonus_type = 'scratch-card-bonus'
                        ${where}
                ), 2)::DOUBLE PRECISION AS pending_to_claim_gc_bonus,
                 CAST(ct.more_details->>'scratchCardId' AS INTEGER) AS scratch_card_id
          FROM 
              users u
          JOIN 
              public.casino_transactions ct 
              ON u.user_id = ct.user_id
              AND ct.created_at BETWEEN :startDate AND :endDate
              AND ct.action_id = '1'
              AND ct.action_type = :bonusType
              AND ct.status = 1
          WHERE 
              ${whereClause}
          GROUP BY 
              ${groupByFields}
          ORDER BY 
              ${orderByFields}
          OFFSET :offset LIMIT :limit`,
          {
            type: QueryTypes.SELECT,
            replacements
          }
      )

      return { success: true, count: +count, rows: response }
    } catch (error) {
      console.log(error)
    }
  }
}
