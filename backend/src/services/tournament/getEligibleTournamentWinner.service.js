import { divide, round, times } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'
import { Op } from 'sequelize'

export class GetEligibleTournamentWinnerService extends ServiceBase {
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
      const tournament = await TournamentModel.findOne({ where: { tournamentId } })

      if (!tournament) return this.addError('TournamentNotExistErrorType')
      if ([TOURNAMENT_STATUS.UPCOMING, TOURNAMENT_STATUS.RUNNING].includes(+tournament?.status)) {
        return this.addError('TournamentNotFinishedErrorType')
      }

      const eligibleUsers = await UserTournamentModel.findAll({
        attributes: ['tournamentId', 'userId', 'score', 'ggr', 'playerBet', 'playerWin', 'isBooted', 'isCompleted',
          [sequelize.literal('RANK() OVER (ORDER BY score DESC)'), 'rank']
        ],
        where: {
          tournamentId: +tournament.tournamentId,
          isBooted: false,
          score: {
            [Op.gt]: 0
          }
        },
        include: [{
          model: UserModel,
          attributes: ['username', 'email']
        }],
        order: [['score', 'DESC']],
        limit: tournament.winnerPercentage.length
      })
      if (tournament.winnerPercentage.length < eligibleUsers.length) {
        return this.addError('InvalidWinnerPercentageErrorType')
      }

      const isPayoutCompleted = eligibleUsers.some(player => player.isCompleted)
      if (!eligibleUsers || eligibleUsers.length === 0) {
        return { success: true, data: { isPayoutCompleted }, message: 'No one win the tournament' }
      }

      const updatedEligibleUsers = eligibleUsers
        .map((user, index) => {
          const { winSc, winGc, winnerPercentage } = tournament
          const winPercent = winnerPercentage[index]
          const scWinAmount = +round(+divide(+times(+winSc, winPercent), 100), 2)
          const gcWinAmount = +round(+divide(+times(+winGc, winPercent), 100), 2)

          return { ...user.get({ plain: true }), scWinAmount, gcWinAmount }
        })

      return ({ success: true, data: { updatedEligibleUsers, isPayoutCompleted }, message: 'Eligible Winner for the tournament' })
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
