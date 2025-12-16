import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { removeData, convertToWebPAndUpload } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    promotionThumbnailId: { type: 'string', pattern: '^[0-9]+$' },
    name: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    navigateRoute: { type: ['string', 'null'] }
  },
  required: ['promotionThumbnailId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdatePromotionThumbnailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { name, promotionThumbnailId, isActive, navigateRoute } = this.args
    const promotionThumbnailImageExist = this.context.req.file
    let promotionThumbnailImage
    const {
      dbModels: {
        promotionThumbnails: promotionThumbnailsModel
      },
      sequelizeTransaction: transaction
    } = this.context
    let updateObj
    try {
      const isPromotionTHumbnailExist = await promotionThumbnailsModel.findOne({
        where: { promotionThumbnailId },
        attributes: ['promotionThumbnailId', 'desktopImageUrl', 'name']
      })

      if (!isPromotionTHumbnailExist) return this.addError('PromotionThumbnailNotFoundErrorType')

      updateObj = {
        isActive,
        name,
        navigateRoute
      }

      let PromotionThumbnailWebPFileName
      if (promotionThumbnailImageExist && typeof promotionThumbnailImageExist === 'object') {
        promotionThumbnailImage = this.context.req.file
        const fileName = `${config.get('env')}/assets/desktop/${
          LOGICAL_ENTITY.PROMOTION_THUMBNAIL
        }/${promotionThumbnailId}-${Date.now()}.webp`
        PromotionThumbnailWebPFileName = await convertToWebPAndUpload(promotionThumbnailImage, fileName)

        updateObj = { ...updateObj, desktopImageUrl: PromotionThumbnailWebPFileName }
      }

      const updatePromotionThumbnail = await promotionThumbnailsModel.update(
        updateObj,
        {
          where: { promotionThumbnailId },
          transaction
        }
      )
      await removeData('PromotionThumbnailData')
      return { updatePromotionThumbnail, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
