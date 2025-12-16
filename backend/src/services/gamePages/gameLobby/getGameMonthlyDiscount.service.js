import { Op } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { pageValidation } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetGameMonthlyDiscountService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameMonthlyDiscount: GameMonthlyDiscountModel
      }
    } = this.context

    const { gameMonthlyDiscountId, masterCasinoGameId, pageNo, limit, startMonthDate, endMonthDate, orderBy, sort } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let whereQuery = { masterCasinoGameId: +masterCasinoGameId }

      if (gameMonthlyDiscountId) whereQuery = { ...whereQuery, gameMonthlyDiscountId: +gameMonthlyDiscountId }

      if (startMonthDate && endMonthDate) {
        whereQuery = {
          ...whereQuery,
          startMonthDate: { [Op.gte]: startMonthDate },
          endMonthDate: { [Op.lte]: endMonthDate }
        }
      }

      const gameMonthlyDiscountDetail = await GameMonthlyDiscountModel.findAndCountAll({
        attributes: ['gameMonthlyDiscountId', 'masterCasinoGameId', 'startMonthDate', 'endMonthDate', 'discountPercentage'],
        where: whereQuery,
        order: [[orderBy || 'startMonthDate', sort || 'DESC']],
        limit: size,
        offset: (page - 1) * size
      })

      return {
        success: true,
        gameMonthlyDiscountDetail,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
