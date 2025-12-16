import ajv from '../../libs/ajv'
import { removeData } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    }
  },
  required: ['order']
}

const constraints = ajv.compile(schema)

export class OrderPromotionThumbnailService extends ServiceBase {
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
    const { order } = this.args
    try {
      const promises = order.map(async (id, index) => {
        const checkExists = await promotionThumbnailsModel.findOne({ where: { promotionThumbnailId: id }, transaction })
        if (checkExists) await promotionThumbnailsModel.update({ orderId: index + 1 }, { where: { promotionThumbnailId: id }, transaction })
      })

      await Promise.all(promises)
      await removeData('PromotionThumbnailData')
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
