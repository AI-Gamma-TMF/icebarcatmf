import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { Op } from 'sequelize'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    search: { type: ['string'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetPagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, search, orderBy, sort } = this.args

    const {
      dbModels: {
        PageContent: PageContentModel
      }
    } = this.context
    let query
    if (search) {
      query = { ...query, pageName: {[Op.iLike]: `%${search.trim()}%`} }
    }

    try {
      const { page, size } = pageValidation(pageNo, limit)
      let pages
      if (pageNo && limit) {
        pages = await PageContentModel.findAndCountAll({
          attributes: ['pageId', 'pageName', 'createdAt', 'updatedAt'],
          where: query,
          order: [[orderBy || 'pageId', sort || 'ASC']],
          limit: size,
          offset: ((page - 1) * size)
        })
      } else {
        pages = await PageContentModel.findAndCountAll({
          attributes: ['pageId', 'pageName', 'createdAt', 'updatedAt'],
          where: query,
          order: [[orderBy || 'pageId', sort || 'ASC']],
        })
      }

      return { pages: pages, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
