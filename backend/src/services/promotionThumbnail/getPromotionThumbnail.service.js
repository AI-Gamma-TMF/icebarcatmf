import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, prepareImageUrl } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    pageNo: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    promotionThumbnailId: {
      type: 'string'
    },
    orderBy: {
      type: 'string'
    },
    sort: {
      type: 'string'
    },
    isActive: { type: 'string', enum: ['true', 'false', 'all'] },
    search: { type: ['string', 'null', 'number'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetPromotionThumbnailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        promotionThumbnails: promotionThumbnailsModel
      }
    } = this.context
    try {
      const { pageNo, limit, isActive, promotionThumbnailId, orderBy, sort, search } = this.args
      const { page, size } = pageValidation(pageNo, limit)
      let query = { }
      if (search) {
        query = {
          ...query,
          name: { [Op.iLike]: `%${search}%` }
        }
      }
      if (isActive && isActive !== 'all') query = { ...query, isActive: isActive }
      if (promotionThumbnailId && +promotionThumbnailId) query = { ...query, promotionThumbnailId: +promotionThumbnailId }

      const promotionThumbnail = await promotionThumbnailsModel.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: query,
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderBy || 'promotionThumbnailId', sort || 'DESC']]
      })

      const promotionThumbnailArray = []
      for (const promotionThumbnailImages of promotionThumbnail.rows) {
        promotionThumbnailImages.dataValues.promotionThumbnailImages = prepareImageUrl(promotionThumbnailImages.desktopImageUrl)
        promotionThumbnailImages.dataValues.name = promotionThumbnailImages.name
        promotionThumbnailImages.dataValues.navigateRoute = promotionThumbnailImages.navigateRoute
        delete promotionThumbnailImages.dataValues.desktopImageUrl
        delete promotionThumbnailImages.dataValues.mobileImageUrl
        promotionThumbnailArray.push(promotionThumbnailImages)
      }
      promotionThumbnail.rows = promotionThumbnailArray

      return { promotionThumbnail, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
