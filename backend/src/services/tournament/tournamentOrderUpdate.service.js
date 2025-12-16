import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class TournamentOrderUpdateService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tournament: TournamentModel },
      sequelizeTransaction: transaction
    } = this.context
    const { order } = this.args

    try {
      const orderPromises = order.map(async (id, index) => {
        await TournamentModel.update({ orderId: index + 1 }, {
          where: { tournamentId: id },
          transaction
        })
      })
      await Promise.all(orderPromises)
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
