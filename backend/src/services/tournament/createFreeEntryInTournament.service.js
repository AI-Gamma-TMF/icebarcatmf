import ServiceBase from '../../libs/serviceBase'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class CreateFreeEntryInTournamentService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { email, tournamentId } = this.args

    try {
      const user = await UserModel.findOne({ where: { email: email } })

      if (!user) {
        return this.addError('UserNotExistsErrorType')
      }
      const userId = +user.userId

      const tournament = await TournamentModel.findOne({ where: { tournamentId: tournamentId } })

      if (!tournament) {
        return this.addError('TournamentNotFoundErrorType')
      }

      if (+tournament?.status === TOURNAMENT_STATUS.CANCELLED || +tournament?.status === TOURNAMENT_STATUS.COMPLETED) {
        return this.addError('TournamentAlreadyFinishedErrorType')
      }

      const userAlreadyInTournament = await UserTournamentModel.findOne({ where: { tournamentId: tournamentId, userId: userId } })

      if (userAlreadyInTournament) {
        return this.addError('UserAlreadyInTournamentErrorType')
      }

      const createObj = {
        userId: userId,
        tournamentId: tournamentId,
        isBooted: false
      }

      const userFreeEntry = await UserTournamentModel.create(createObj, { transaction })

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS,
        data: { UserTournamentId: userFreeEntry.userTournamentId }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
