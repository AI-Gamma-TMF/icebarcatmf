import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    search: { type: ['string'] },
    isActive: {
      type: ['string'],
      enum: ['true', 'false', 'all']
    },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetAllCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let query
    const { limit, pageNo, search, isActive = 'all', sort, orderBy } = this.args
    const language = this.context.language
    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (search) {
        query = {
          ...query,
          [Op.or]: [{ title: { [`${language}`]: { [Op.iLike]: `%${search}%` } } },
            { slug: { [Op.iLike]: `%${search}%` } },
            { content: { [`${language}`]: { [Op.iLike]: `%${search}%` } } }]
        }
      }
      if ((isActive !== 'all')) query = { ...query, isActive }

      query = { ...query }

      const cmsPages = await db.CmsPage.findAndCountAll({
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        where: query,
        limit: size,
        offset: ((page - 1) * size)
      })
      return { cmsPages, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
