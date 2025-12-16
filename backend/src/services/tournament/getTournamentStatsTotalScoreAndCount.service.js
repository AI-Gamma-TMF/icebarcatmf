import ServiceBase from '../../libs/serviceBase'
import { TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

export class GetTournamentStatsTotalScoreAndCount extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserTournament: UserTournamentModel
      },
      sequelize
    } = this.context

    const { tournamentId, timezone } = this.args
    try {
      if (!tournamentId) {
        return this.addError('TournamentNotExistErrorType')
      }
      const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone] || 'UTC'

      const timezoneConversion = `TO_CHAR(created_at AT TIME ZONE '${userTimezone}', 'YYYY-MM-DD')`

      const [totalScoreOfPlayers, playerCountJoinByDate] = await Promise.all([
        UserTournamentModel.findAll({
          attributes: [
            [sequelize.col('User.username'), 'username'],
            'score'
          ],
          where: { tournamentId },
          include: [
            {
              model: UserModel,
              attributes: []
            }
          ],
          order: [['score', 'DESC']],
          raw: true
        }),
        UserTournamentModel.findAll({
          attributes: [
            [sequelize.literal(timezoneConversion), 'joinDate'],
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'playerCount']
          ],
          where: { tournamentId },
          group: [sequelize.literal(timezoneConversion)],
          order: [[sequelize.literal(timezoneConversion), 'ASC']],
          raw: true
        })
      ])

      return {
        success: true,
        data: {
          totalScoreOfPlayers, playerCountJoinByDate
        },
        message: 'Successfully Get Tournament Dashboard Data'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
