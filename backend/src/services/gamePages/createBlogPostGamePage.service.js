import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

// Validation schema
const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: ['string', 'integer'] },
    blogPostId: { type: ['string', 'integer'] }
  },
  required: ['blogPostId', 'gamePageId']
}

const constraints = ajv.compile(schema)

export class CreateBlogPostGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { BlogPostGamePage: BlogPostGamePageModel }, sequelizeTransaction: transaction } = this.context
    const { gamePageId, blogPostId } = this.args

    try {
      const blogPostGamePage = await BlogPostGamePageModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { gamePageId, blogPostId }
      })

      if (blogPostGamePage) return this.addError('blogPostGamePageExistsErrorType')

      await Promise.all([
        BlogPostGamePageModel.create({
          gamePageId, blogPostId
        }, {
          transaction
        }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
