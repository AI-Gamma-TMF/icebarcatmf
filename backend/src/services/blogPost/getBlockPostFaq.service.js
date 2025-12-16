import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

// Validation schema for input
const schema = {
  type: 'object',
  properties: {
    blogPostId: { type: ['integer', 'null'] },
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'], enum: ['true', 'false', 'all'] }
  },
  required: ['blogPostId']
}

const constraints = ajv.compile(schema)

export class GetBlogPostFaqService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Faq: FaqModel }
    } = this.context

    const { blogPostId, limit, pageNo, sort, orderBy, search, isActive } = this.args
    const query = { blogPostId }
    let faqs

    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (search) {
        query.question = { [Op.iLike]: `%${search}%` }
      }

      if (isActive && isActive !== 'all') {
        query.isActive = isActive === 'true'
      }

      const commonOptions = {
        where: query,
        order: [[orderBy || 'createdAt', sort || 'ASC']],
        attributes: [
          'faqId',
          'question',
          'answer',
          'blogPostId'
        ]
      }

      if (limit && pageNo) {
        faqs = await FaqModel.findAndCountAll({
          ...commonOptions,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        faqs = await FaqModel.findAndCountAll(commonOptions)
      }

      return {
        faqs,
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
