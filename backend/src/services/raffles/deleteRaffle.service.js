import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteRaffleService extends ServiceBase {
  async run () {
    const {
      dbModels: { Raffles: RafflesModel },
      sequelizeTransaction: transaction
    } = this.context

    const { raffleId } = this.args
    try {
      const raffle = await RafflesModel.findOne({
        where: { raffleId },
        transaction
      })

      if (!raffle) {
        return this.addError('GiveawaysNotExistErrorType')
      }

      await RafflesModel.destroy({
        where: { raffleId },
        paranoid: true,
        cascade: true,
        transaction
      })

      await removeData('activeRaffleDetails')

      return { message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
