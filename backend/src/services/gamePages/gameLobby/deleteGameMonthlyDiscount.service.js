import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class DeleteGameMonthlyDiscountService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameMonthlyDiscount: GameMonthlyDiscountModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { gameMonthlyDiscountId } = this.args

    try {
      const isExist = await GameMonthlyDiscountModel.findOne({
        where: {
          gameMonthlyDiscountId: gameMonthlyDiscountId
        },
        transaction
      })

      if (!isExist) return this.addError('GameMonthlyDiscountNotExistErrorType')

      await GameMonthlyDiscountModel.destroy({
        where: { gameMonthlyDiscountId },
        transaction
      })

      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
