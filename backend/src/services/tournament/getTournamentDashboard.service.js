import { divide, times, round, minus } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'

export class GetTournamentDashboardService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel
      },
      sequelize
    } = this.context

    const { tournamentId } = this.args
    try {
      const tournament = await TournamentModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { tournamentId },
        raw: true
      })
      if (!tournament) {
        return this.addError('TournamentNotExistErrorType')
      }

      const priceDistribution = tournament.winnerPercentage.map((percent, index) => ({
        position: index + 1,
        scCoin: +round(+divide(times(+tournament.winSc, percent), 100), 2),
        gcCoin: +round(+divide(times(+tournament.winGc, percent), 100), 2)
      }))
      // Game wise GGR data
      let gameBetWinStats
      if (tournament.gameBetWinStats) {
        gameBetWinStats = Object.entries(tournament.gameBetWinStats).reduce((acc, [id, stats]) => {
          acc.push({
            gameId: +id,
            totalBet: stats.totalBet,
            totalWin: stats.totalWin,
            ggr: stats.totalBet - stats.totalWin
          })
          return acc
        }, [])
        // Not much required as of now
        // gameBetWinStats.sort((a, b) => b.ggr - a.ggr)
      }

      const [totalPlayerCount, top10Players] = await Promise.all([
        UserTournamentModel.count({ where: { tournamentId: tournamentId }, raw: true }),
        UserTournamentModel.findAll({
          attributes: [
            ['player_win', 'win'],
            [sequelize.col('User.username'), 'username'],
            ['player_bet', 'bet']
          ],
          where: {
            tournamentId: tournamentId,
            isBooted: false
          },
          include: [
            {
              model: UserModel,
              attributes: []
            }
          ],
          order: [['score', 'DESC']],
          limit: 10,
          raw: true
        })
      ])
      let ggr = null
      if (tournament.totalBet && tournament.totalWin) {
        ggr = +round(+minus(+tournament?.totalBet, +tournament?.totalWin), 2)
      }
      return {
        success: true,
        data: {
          tournamentSummary: {
            ggr: ggr,
            totalWin: tournament.totalWin,
            totalBet: tournament.totalBet,
            totalPlayerCount,
            pricePoolSc: tournament.winSc,
            pricePoolGc: tournament.winGc,
            noOfWinners: tournament?.winnerPercentage.length
          },
          priceDistribution,
          gameBetWinStats: gameBetWinStats,
          top10Players
        },
        message: 'Successfully Get Tournament Dashboard Data'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
