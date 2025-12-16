import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'

export class GetTournamentDashboardWinnerBootedSummary extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserTournament: UserTournamentModel
      },
      sequelize
    } = this.context

    const { tournamentId } = this.args
    try {
      const queryAttributes = [
        'tournamentId', 'userId', 'score', 'isCompleted', 'playerBet', 'playerWin', 'ggr',
        'scWinAmount', 'gcWinAmount', 'isWinner', 'createdAt', 'isBooted',
        [sequelize.literal(`
            CASE 
                WHEN rank IS NULL THEN RANK() OVER (ORDER BY score DESC) 
                ELSE rank 
            END
        `), 'rank']
      ]

      const userInclude = [
        {
          model: UserModel,
          attributes: ['username', 'email']
        }
      ]

      const [bootedPlayers, tournamentWinners, topPositiveGgr, topNegativeGgr] = await Promise.all([
        UserTournamentModel.findAll({
          attributes: queryAttributes,
          where: { tournamentId: +tournamentId, isBooted: true },
          include: userInclude,
          order: [['rank', 'ASC'], ['score', 'DESC']]
        }),

        UserTournamentModel.findAll({
          attributes: queryAttributes,
          where: { tournamentId: +tournamentId, isWinner: true },
          include: userInclude,
          order: [['rank', 'ASC'], ['score', 'DESC']],
          limit: 10
        }),

        UserTournamentModel.findAll({
          attributes: queryAttributes,
          where: { tournamentId: +tournamentId, ggr: { [Op.ne]: null } },
          include: userInclude,
          order: [['ggr', 'DESC']],
          limit: 5
        }),

        UserTournamentModel.findAll({
          attributes: queryAttributes,
          where: { tournamentId: +tournamentId },
          include: userInclude,
          order: [['ggr', 'ASC']],
          limit: 5
        })
      ])

      return {
        success: true,
        data: { bootedPlayers, tournamentWinners, topPositiveGgr, topNegativeGgr },
        message: 'Successfully Get Tournament Dashboard Data'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
