import { Op } from 'sequelize'
import db from '../../db/models'
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
    pageBannerId: {
      type: 'string'
    },
    orderBy: {
      type: 'string'
    },
    sort: {
      type: 'string'
    },
    visibility: { type: ['string', 'null'], enum: ['1', '0'] },
    status: { type: 'string', enum: ['true', 'false', 'all'] },
    search: { type: ['string', 'null', 'number'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { pageNo, limit, status, pageBannerId, visibility, orderBy, sort, search } = this.args
      const { page, size } = pageValidation(pageNo, limit)
      let query = { }
      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { pageName: { [Op.iLike]: `%${search}%` } },
            { btnRedirection: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }
      if (status && status !== 'all') query = { ...query, isActive: status }
      if (pageBannerId && +pageBannerId) query = { ...query, pageBannerId: +pageBannerId }
      if (visibility) query = { ...query, visibility }

      const orderField = orderBy === 'pageRoute' ? 'pageName' : orderBy === 'navigateRoute' ? 'btnRedirection' : 'pageBannerId'

      const banners = await db.PageBanner.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'textOne', 'textTwo', 'deletedAt', 'name', 'btnText', 'textThree'] },
        where: query,
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderField || 'pageBannerId', sort || 'DESC']]
      })

      const bannersArray = []
      for (const bannersImages of banners.rows) {
        bannersImages.dataValues.bannerImage = prepareImageUrl(bannersImages.desktopImageUrl)
        bannersImages.dataValues.mobileBannerImage = prepareImageUrl(bannersImages.mobileImageUrl)
        bannersImages.dataValues.pageRoute = bannersImages.pageName
        bannersImages.dataValues.isNavigate = !!bannersImages.btnRedirection
        bannersImages.dataValues.navigateRoute = bannersImages.btnRedirection
        delete bannersImages.dataValues.desktopImageUrl
        delete bannersImages.dataValues.mobileImageUrl
        delete bannersImages.dataValues.pageName
        delete bannersImages.dataValues.btnRedirection
        bannersArray.push(bannersImages)
      }
      banners.rows = bannersArray

      return { banners, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
