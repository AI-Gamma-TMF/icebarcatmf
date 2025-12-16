import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    promotionThumbnailId: { type: ['string', 'number'] },
    isActive: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['promotionThumbnailId', 'isActive']
}
const constraints = ajv.compile(schema)
export class UpdatePromotionThumbnailStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        promotionThumbnails: promotionThumbnailsModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const { promotionThumbnailId, isActive } = this.args

      const promotionThumbnail = await promotionThumbnailsModel.findOne({
        where: { promotionThumbnailId }
      })

      if (!promotionThumbnail) {
        return this.addError('PromotionThumbnailNotFoundErrorType')
      }

      await promotionThumbnailsModel.update(
        {
          isActive
        },
        {
          where: { promotionThumbnailId },
          transaction
        }
      )
      await removeData('PromotionThumbnailData')
      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
