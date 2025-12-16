import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

// Validation schema
const schema = {
  type: 'object',
  properties: {
    blogPostId: { type: ['integer', 'string'] },
    faqId: { type: ['integer', 'string'] }
  },
  required: ['blogPostId', 'faqId']
}

const constraints = ajv.compile(schema)

export class DeleteBlogPostFaqService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { blogPostId, faqId } = this.args
    const {
      dbModels: { Faq: FaqModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const faq = await FaqModel.findOne({
        where: { blogPostId, faqId }
      })

      if (!faq) {
        return this.addError('FaqNotExistsErrorType')
      }

      await Promise.all([
        FaqModel.destroy({
          where: { blogPostId, faqId },
          transaction
        }),
        removeData('blogPost-array'),
        removeData('blogPost-object')
      ])

      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
