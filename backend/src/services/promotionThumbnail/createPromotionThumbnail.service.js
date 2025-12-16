import { removeData, prepareImageUrl, convertToWebPAndUpload } from '../../utils/common'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    name: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    navigateRoute: { type: ['string', 'null'] }
  },
  required: ['isActive']
}

const constraints = ajv.compile(schema)

export class CreatePromotionThumbnailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isActive, name, navigateRoute } = this.args

    const {
      dbModels: {
        promotionThumbnails: promotionThumbnailsModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const promotionThumbnailImage = this.context.req.file

    try {
      let lastOrderId = await promotionThumbnailsModel.max('order')
      if (!lastOrderId) lastOrderId = 0
      const bannerData = {
        isActive,
        name: name || '',
        order: lastOrderId + 1,
        navigateRoute: navigateRoute || ''
      }

      const createdPromotionThumbnail = await promotionThumbnailsModel.create(
        bannerData,
        { transaction }
      )

      const promotionThumbnailFileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.PROMOTION_THUMBNAIL}/${createdPromotionThumbnail.promotionThumbnailId}-${Date.now()}.webp`

      const bannerWebPFileName = await convertToWebPAndUpload(promotionThumbnailImage, promotionThumbnailFileName)

      await promotionThumbnailsModel.update(
        {
          desktopImageUrl: bannerWebPFileName
        },
        {
          where: { promotionThumbnailId: createdPromotionThumbnail.promotionThumbnailId },
          transaction
        }
      )

      createdPromotionThumbnail.dataValues.promotionThumbnailImage = prepareImageUrl(bannerWebPFileName)
      const keysToDelete = [
        'desktopImageUrl',
        'mobileImageUrl',
        'name',
        'navigateRoute'
      ]
      keysToDelete.forEach(key => delete createdPromotionThumbnail.dataValues[key])
      await removeData('PromotionThumbnailData')
      return {
        createdPromotionThumbnail,
        message: SUCCESS_MSG.CREATE_SUCCESS,
        success: true
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
