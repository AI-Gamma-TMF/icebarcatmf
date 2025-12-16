import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { JACKPOT_STATUS } from '../../utils/constants/constant'

export class DeleteJackpotService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Jackpot: JackpotModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { jackpotId } = this.args

    const checkJackpotId = await JackpotModel.findOne({ where: { jackpotId, status: JACKPOT_STATUS.UPCOMING }, transaction })

    if (!checkJackpotId) return this.addError('JackpotNotUpcomingErrorType')

    await checkJackpotId.destroy({ where: { jackpotId }, transaction })

    return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
