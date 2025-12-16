import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetCRMPromocodeDetailsById extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel }
    } = this.context

    const { crmPromotionId } = this.args

    const details = await CRMPromotionModel.findOne({
      where: {
        crmPromotionId
      }
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      details
    }
  }
}
