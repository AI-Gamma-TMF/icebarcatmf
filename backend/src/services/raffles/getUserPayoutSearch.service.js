import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetUserPayoutSearchService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel
      }
    } = this.context

    const { raffleId, entryId } = this.args
    try {
      if (!(+raffleId > 0) || !(+entryId > 0)) return this.addError('GiveawaysNotExistErrorType')

      const raffle = await RafflesModel.findOne({
        where: { raffleId, isActive: true },
        raw: true
      })

      if (!raffle) return this.addError('GiveawaysNotExistErrorType')

      const userEntry = await RafflesEntryModel.findOne({
        where: { raffleId, entryId },
        include: [
          {
            model: UserModel,
            attributes: ['username', 'email', 'firstName', 'lastName', [sequelize.literal('CASE WHEN "User"."is_active" = false OR "User"."is_ban" = true or "User"."is_restrict" = true THEN false ELSE true END'), 'isAllowed']],
            required: true
          }
        ],
        raw: true,
        nest: true
      })

      if (!userEntry) return this.addError('UserEntryDoesNotExistErrorType')

      // Find if any other ticket of this user is in win condition
      const isUserAlreadyAWinner = await RafflesEntryModel.findOne({
        where: {
          raffleId,
          entryId,
          isWinner: true
        }
      })

      return {
        rafflePayout: userEntry,
        isUserAlreadyAWinner,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
