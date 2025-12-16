import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    promotionThumbnailId: { type: 'string' }
  },
  required: ['promotionThumbnailId']
}

const constraints = ajv.compile(schema)

export class DeletePromotionThumbnailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { promotionThumbnailId } = this.args
    const {
      dbModels: {
        promotionThumbnails: promotionThumbnailsModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const isPromotionTHumbnailExist = await promotionThumbnailsModel.findOne({
        attributes: ['promotionThumbnailId'],
        where: { promotionThumbnailId },
        raw: true
      })
      if (!isPromotionTHumbnailExist) return this.addError('PromotionThumbnailNotFoundErrorType')
      await promotionThumbnailsModel.destroy({ where: { promotionThumbnailId }, transaction })
      await removeData('PromotionThumbnailData')
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
