import ServiceBase from '../../../libs/serviceBase'
import { sequelize } from '../../../db/models'
import { BONUS_STATUS, BONUS_TYPE } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'
export class GetFreeSpinDashboardService extends ServiceBase {
  async run () {
    try {
      const rawQuery = `
                       SELECT
                          COUNT(*) AS "totalUsers",
                          SUM(CASE WHEN ub.status = :claimed THEN 1 ELSE 0 END) AS "totalClaimed",
                          SUM(CASE WHEN ub.status = :pending THEN 1 ELSE 0 END) AS "totalPending",
                          SUM(CASE WHEN ub.status = :expired THEN 1 ELSE 0 END) AS "totalExpired",
                          SUM(CASE WHEN ub.status = :cancelled  THEN 1 ELSE 0 END) AS "totalCancelled",
                          (SELECT COUNT(*) FROM free_spin_bonus_grant WHERE free_spin_type = 'directGrant') AS "totalDirectGrant",
                          (SELECT COUNT(*) FROM free_spin_bonus_grant WHERE free_spin_type = 'attachedGrant') AS "totalAttachedGrant",
                           ROUND(SUM(CASE WHEN fbg.coin_type = 'SC' AND ub.status = :claimed THEN fbg.free_spin_amount * fbg.free_spin_round ELSE 0 END)::numeric, 2) AS "totalAmountGivenByAdminSC",
                           ROUND(SUM(CASE WHEN fbg.coin_type = 'GC' AND ub.status = :claimed THEN fbg.free_spin_amount * fbg.free_spin_round ELSE 0 END)::numeric, 2) AS "totalAmountGivenByAdminGC",
                           ROUND(SUM(CASE WHEN ub.status = :claimed THEN ub.sc_amount ELSE 0 END)::numeric, 2) AS "totalWinSc",
                           ROUND(SUM(CASE WHEN ub.status = :claimed THEN ub.gc_amount ELSE 0 END)::numeric, 2) AS "totalWinGc"
                        FROM  user_bonus ub
                        JOIN  free_spin_bonus_grant fbg ON fbg.free_spin_id = ub.free_spin_id
                        WHERE "bonus_type" = :bonusType
                       `

      const [[recordSummary]] = await Promise.all([
        sequelize.query(rawQuery, {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            claimed: BONUS_STATUS.CLAIMED,
            pending: BONUS_STATUS.PENDING,
            expired: BONUS_STATUS.EXPIRED,
            cancelled: BONUS_STATUS.CANCELLED,
            bonusType: BONUS_TYPE.FREE_SPIN_BONUS
          }
        })
      ])

      return {
        data: { recordSummary } || [],
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
