import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateUserTournamentPlayerStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        UserTournament: UserTournamentModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { tournamentId, userId, isBooted } = this.args

    try {
      const isUserExist = await UserTournamentModel.findOne({
        where: {
          tournamentId: tournamentId,
          userId: userId
        },
        raw: true
      })
      if (!isUserExist) {
        return this.addError('UserNotExistErrorType')
      }
      if (isUserExist.isCompleted) {
        return this.addError('CannotBootPlayerErrorType')
      }

      await UserTournamentModel.update({ isBooted }, {
        where: {
          tournamentId: tournamentId,
          userId: userId
        },
        transaction
      })

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
        data: { userId, isBooted, tournamentId }
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
