import ServiceBase from '../../libs/serviceBase'
import { Op } from 'sequelize'

export class GetTournamentStatsFilterDashboardService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserTournament: UserTournamentModel,
        MasterCasinoGame: MasterCasinoGameModel,
        Tournament: TournamentModel
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
      const [totalGames, totalUserId] = await Promise.all([
        MasterCasinoGameModel.findAll({
          attributes: [
            [sequelize.literal('json_object_agg(master_casino_game_id, name)'), 'totalGameIdInTournament']
          ],
          where: { masterCasinoGameId: { [Op.in]: tournament.gameId } },
          raw: true
        }),
        UserTournamentModel.findAll({
          attributes: [
            [
              sequelize.literal('json_object_agg("User"."user_id", "User"."email")'),
              'totalUserIdOfPlayers'
            ]
          ],
          where: { tournamentId },
          include: [
            {
              model: UserModel,
              attributes: []
            }
          ],
          raw: true
        })
      ])
      const totalGameIdInTournament = totalGames[0]?.totalGameIdInTournament || {}
      const totalUserIdOfPlayers = totalUserId[0]?.totalUserIdOfPlayers || {}

      return {
        success: true,
        data: {
          totalGameIdInTournament,
          totalUserIdOfPlayers
        },
        message: 'Successfully Get Tournament Dashboard Filter Data'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
