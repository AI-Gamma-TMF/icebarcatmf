import ServiceBase from '../../../libs/serviceBase'
import { sequelize } from '../../../db/models'
import { BONUS_STATUS } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'
export class GetFreeSpinDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel
      }
    } = this.context

    const { freeSpinId } = this.args
    try {
      const freeSpinExist = await FreeSpinBonusGrantModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'isNotifyUser', 'moreDetails'] },
        where: { freeSpinId },
        raw: true
      })

      if (!freeSpinExist) return this.addError('FreeSpinBonusNotExistErrorType')

      const amountColumn = freeSpinExist?.coinType === 'SC' ? 'sc_amount' : 'gc_amount'

      const recordQuery = `
                        SELECT
                          COUNT(*) AS "totalUsers",
                          SUM(CASE WHEN status = :claimed THEN 1 ELSE 0 END) AS "totalClaimed",
                          SUM(CASE WHEN status = :pending THEN 1 ELSE 0 END) AS "totalPending",
                          SUM(CASE WHEN status = :expired THEN 1 ELSE 0 END) AS "totalExpired",
                          SUM("${amountColumn}") AS "totalWinAmount"
                        FROM "user_bonus"
                        WHERE "free_spin_id" = :freeSpinId
                       `
      const gameQuery = `
                SELECT
                  master_casino_game_id AS "masterCasinoGameId",
                  game_name AS "gameName",
                  game_identifier AS "gameIdentifier",
                  free_spins_allowed AS "freeSpinsAllowed",
                  provider_id AS "masterCasinoProviderId",
                  provider_name AS "providerName",
                  aggregator_id AS "masterGameAggregatorId",
                  aggregator_name AS "aggregatorName"
                FROM public.game_data_view
                WHERE master_casino_game_id = :masterCasinoGameId AND provider_id = :providerId
               `

      const { masterCasinoGameId, providerId } = freeSpinExist || {}

      const bonusInfoPromise = sequelize.query(recordQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          freeSpinId,
          claimed: BONUS_STATUS.CLAIMED,
          pending: BONUS_STATUS.PENDING,
          expired: BONUS_STATUS.EXPIRED
        }
      })

      const gameInfoPromise = sequelize.query(gameQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          masterCasinoGameId,
          providerId
        }
      })

      const [[recordSummary], [gameInfo]] = await Promise.all([
        bonusInfoPromise,
        gameInfoPromise
      ])

      return { data: { freeSpinExist, recordSummary, gameInfo } || [], success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
