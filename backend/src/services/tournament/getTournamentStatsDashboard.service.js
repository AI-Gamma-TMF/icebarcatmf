import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { CASINO_TRANSACTION_STATUS } from '../../utils/constants/constant'
import { calculateUTCDateRangeForTimezoneRange, tournamentStatsPerDayByCustomQuery } from '../../utils/common'

export class GetTournamentStatsDashboardService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel
      }
    } = this.context

    let { tournamentId, startDate, endDate, userId, gameId, timezone } = this.args
    try {
      const tournament = await TournamentModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { tournamentId }
      })
      if (!tournament) {
        return this.addError('TournamentNotExistErrorType')
      }
      const coin = tournament?.entryCoin === 'SC' ? 1 : 0

      if (startDate && endDate && timezone) {
        const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
        startDate = result?.startDateUTC
        endDate = result?.endDateUTC
      }

      if (startDate) {
        // startDate = new Date(startDate)
        if (startDate <= tournament.startDate || startDate >= tournament.endDate) {
          startDate = tournament.startDate
        }
      } else {
        startDate = tournament.startDate
      }
      if (endDate) {
        // endDate = new Date(endDate)
        // if (endDate.getHours() === 0 && endDate.getMinutes() === 0 && endDate.getSeconds() === 0) {
        //   endDate.setHours(23, 59, 59, 999)
        // }
        if (endDate >= tournament.endDate || endDate <= tournament.startDate) {
          endDate = tournament.endDate
        }
      } else {
        endDate = tournament.endDate
      }

      let casinoTransactionQuery = {
        amountType: coin,
        tournamentId: +tournament.tournamentId,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
      if (gameId) { casinoTransactionQuery = { ...casinoTransactionQuery, gameId: `${gameId}` } }
      if (userId) { casinoTransactionQuery = { ...casinoTransactionQuery, userId: userId } }

      const { tournamentStats, totalWin, totalBet, ggr } = await tournamentStatsPerDayByCustomQuery(casinoTransactionQuery)
      return {
        success: true,
        data: {
          tournamentStatsByStartEndDate: tournamentStats,
          tournamentTotalWinByStartEndDate: totalWin,
          tournamentTotalBetByStartEndDate: totalBet,
          tournamentGGRByStartEndDate: ggr
        },
        message: 'Successfully Get Tournament Stats Data'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
