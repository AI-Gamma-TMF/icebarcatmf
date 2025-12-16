import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    blogPostId: {
      type: ['string', 'null']
    },
    search: {
      type: ['string', 'null']
    },
    isActive: {
      type: ['string', 'null']
    },
    orderBy: {
      type: ['string', 'null']
    },
    sort: {
      type: ['string', 'null']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBlogPostService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPost: BlogPostModel, GamePages: GamePagesModel }
    } = this.context

    const { pageNo, limit, blogPostId, search, isActive = 'all', orderBy, sort } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let query = {}

      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { metaTitle: { [Op.iLike]: `%${search}%` } },
            { slug: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }

      if ((isActive !== 'all')) query = { ...query, isActive }

      if (blogPostId) query = { ...query, blogPostId: +blogPostId }

      const attributes = blogPostId ? { exclude: ['updatedAt', 'deletedAt'] } : { exclude: ['contentBody', 'updatedAt', 'deletedAt'] }
      const findOptions = {
        attributes,
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'createdAt', sort || 'DESC']]
      }
      if (blogPostId) {
        findOptions.include = [
          {
            model: GamePagesModel,
            where: { isActive: true },
            as: 'gamePages',
            through: { attributes: [] },
            attributes: ['title', 'gamePageId'],
            required: false
          }
        ]
      }
      const blogPostDetails = await BlogPostModel.findAndCountAll(findOptions)

      return { blogPostDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
