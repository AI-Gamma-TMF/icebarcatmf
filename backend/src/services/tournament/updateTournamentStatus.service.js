import ServiceBase from '../../libs/serviceBase'
import { tournamentJobScheduler, triggerTournamentCancelNotification } from '../../utils/common'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'

export class UpdateTournamentStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { tournamentId } = this.args
    let responseMessage
    try {
      const tournament = await TournamentModel.findOne({
        where: { tournamentId }
      })

      if (!tournament) return this.addError('TournamentNotExistErrorType')
      if (+tournament.status === TOURNAMENT_STATUS.CANCELLED) return this.addError('TournamentIsCancelledErrorType')
      if (+tournament.status === TOURNAMENT_STATUS.COMPLETED) return this.addError('CannotCancelTournamentErrorType')
      if (+tournament.status === TOURNAMENT_STATUS.RUNNING) {
        responseMessage = 'Tournament is cancelled, If payout needs to be done, please proceed with payout button.'
      }
      await TournamentModel.update(
        {
          status: TOURNAMENT_STATUS.CANCELLED
        },
        {
          where: { tournamentId },
          transaction
        }
      )
      tournamentJobScheduler('PATCH', +tournament.tournamentId)

      triggerTournamentCancelNotification(
        tournament.title,
        tournament.entryAmount,
        tournament.winGc,
        tournament.winSc,
        tournament.startDate,
        tournament.endDate,
        tournament.tournamentId,
        tournament.imageUrl || ''
      )

      return { success: true, message: responseMessage || 'Tournament is cancelled successfully' }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
