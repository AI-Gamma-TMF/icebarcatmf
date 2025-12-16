import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: ['string', 'integer'] },
    blogPostId: { type: ['string', 'integer'] }
  },
  required: ['blogPostId', 'gamePageId']
}

const constraints = ajv.compile(schema)

export class DeleteBlogPostGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPostGamePage: BlogPostGamePageModel },
      sequelizeTransaction: transaction
    } = this.context

    const { gamePageId, blogPostId } = this.args

    try {
      const isExist = await BlogPostGamePageModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { gamePageId, blogPostId }
      })

      if (!isExist) return this.addError('blogPostGamePageExistsErrorType')

      await Promise.all([
        BlogPostGamePageModel.destroy({
          where: { gamePageId, blogPostId },
          transaction
        }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
