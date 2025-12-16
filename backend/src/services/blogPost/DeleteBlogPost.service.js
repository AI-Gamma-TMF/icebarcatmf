import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    blogPostId: { type: 'number' }
  },
  required: ['blogPostId']
}

const constraints = ajv.compile(schema)

export class DeleteBlogPostService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPost: BlogPostModel },
      sequelizeTransaction: transaction
    } = this.context

    const { blogPostId } = this.args

    try {
      const isExist = await BlogPostModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { blogPostId },
        transaction
      })

      if (!isExist) return this.addError('BlogPostNotFoundErrorType')

      await Promise.all([
        BlogPostModel.destroy({
          where: { blogPostId },
          transaction
        }),
        removeData('blogPost-array'),
        removeData('blogPost-object'),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
