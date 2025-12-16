import ServiceBase from '../../libs/serviceBase'
import { tournamentPayoutJobScheduler } from '../../utils/common'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'

export class CreateTournamentPayoutService extends ServiceBase {
  async run () {
    // need to understand how frontend will send the users array
    const {
      dbModels: {
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel

      }
    } = this.context
    const { tournamentId } = this.args

    try {
      const tournament = await TournamentModel.findOne({
        where: { tournamentId }
      })

      if (!tournament) return this.addError('TournamentNotExistErrorType')

      if ([TOURNAMENT_STATUS.UPCOMING, TOURNAMENT_STATUS.RUNNING].includes(+tournament?.status)) {
        return this.addError('TournamentNotFinishedErrorType')
      }
      const isPayoutCompleted = await UserTournamentModel.findOne({
        where: {
          tournamentId: +tournamentId,
          isCompleted: true
        }
      })
      if (isPayoutCompleted) {
        return this.addError('PayoutIsAlreadyCompletedTournamentErrorType')
      }
      const data = tournamentPayoutJobScheduler('POST', +tournamentId)
      return { data: data, success: true, message: 'Tournament Payout In Progress' }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
