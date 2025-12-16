import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class CreateGameMonthlyDiscountService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameMonthlyDiscount: GameMonthlyDiscountModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { masterCasinoGameId, startMonthDate, endMonthDate, discountPercentage } = this.args

    try {
      const isExist = await GameMonthlyDiscountModel.findOne({
        where: {
          masterCasinoGameId,
          startMonthDate,
          endMonthDate
        },
        transaction
      })

      if (isExist) return this.addError('DiscountAlreadyExistsForThisMonthErrorType')

      await GameMonthlyDiscountModel.create({
        masterCasinoGameId,
        startMonthDate,
        endMonthDate,
        discountPercentage
      }, { transaction })

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
