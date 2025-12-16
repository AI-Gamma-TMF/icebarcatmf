import ServiceBase from '../../libs/serviceBase'
import { removeData, triggerGiveawayChangeNotification } from '../../utils/common'
import { RAFFLE_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

/**
 * Provides service to create new affiliate
 * @export
 * @class CreateAffiliateService
 * @extends {ServiceBase}
 */
export class UpdateRaffleStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: { Raffles: RafflesModel, RafflesEntry: RafflesEntryModel },
      sequelizeTransaction: transaction
    } = this.context
    const { raffleId, isActive } = this.args
    const { id } = this.context.req.body

    try {
      const raffleExist = await RafflesModel.findOne({
        where: { raffleId },
        transaction
      })

      if (!raffleExist) return this.addError('GiveawaysNotExistErrorType')

      const alreadyEntryUsers = await RafflesEntryModel.findOne({ where: { raffleId } }, { transaction })
      if (alreadyEntryUsers && raffleExist.status !== RAFFLE_STATUS.COMPLETED) return this.addError('CannotDeActivateAsPlayersHaveEntries')

      await RafflesModel.update(
        {
          isActive
        },
        {
          where: {
            raffleId
          },
          transaction
        }
      )
      await removeData('activeRaffleDetails')

      triggerGiveawayChangeNotification(raffleExist.title, id, isActive ? 'updated' : 'deactivated')

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
