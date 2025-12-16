import ServiceBase from '../../libs/serviceBase'
import { createOptimovePromocode, deleteOptimovePromocode } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateCRMPromocodeStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel },
      sequelizeTransaction: transaction
    } = this.context

    const { crmPromotionId, isActive } = this.args

    const findPromocode = await CRMPromotionModel.findOne({
      where: { crmPromotionId },
      transaction
    })

    if (!findPromocode) return this.addError('PromocodeDoesNotExistsErrorType')

    if (isActive) {
      // create promocode at optimove server
      await createOptimovePromocode(findPromocode.promocode, findPromocode.name)
    } else {
      // delete promocode from optimove server
      await deleteOptimovePromocode(findPromocode.promocode)
    }

    await CRMPromotionModel.update(
      {
        isActive
      },
      {
        where: {
          crmPromotionId
        },
        transaction
      }
    )

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
