import { Op } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class UpdateGameMonthlyDiscountService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameMonthlyDiscount: GameMonthlyDiscountModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      gameMonthlyDiscountId,
      masterCasinoGameId,
      startMonthDate,
      endMonthDate,
      discountPercentage
    } = this.args

    try {
      // Check if record exists
      const isExist = await GameMonthlyDiscountModel.findOne({
        where: {
          gameMonthlyDiscountId: gameMonthlyDiscountId
        },
        transaction
      })

      if (!isExist) return this.addError('GameMonthlyDiscountNotExistErrorType')

      const isConflict = await GameMonthlyDiscountModel.findOne({
        where: {
          gameMonthlyDiscountId: { [Op.ne]: gameMonthlyDiscountId },
          masterCasinoGameId,
          startMonthDate,
          endMonthDate
        },
        transaction
      })

      if (isConflict) return this.addError('DiscountAlreadyExistsForThisMonthErrorType')

      await GameMonthlyDiscountModel.update({
        masterCasinoGameId,
        startMonthDate,
        endMonthDate,
        discountPercentage
      }, { where: { gameMonthlyDiscountId }, transaction })

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
