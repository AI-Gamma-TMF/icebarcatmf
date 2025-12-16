import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    blogPostId: { type: 'number' },
    isActive: { type: 'boolean' }
  },
  required: ['blogPostId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateBlogPostStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPost: BlogPostModel },
      sequelizeTransaction: transaction
    } = this.context

    const { blogPostId, isActive } = this.args

    try {
      const isExist = await BlogPostModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { blogPostId },
        transaction
      })

      if (!isExist) return this.addError('BlogPostNotFoundErrorType')

      await Promise.all([
        BlogPostModel.update({
          isActive
        }, { where: { blogPostId }, transaction }),
        removeData('blogPost-array'),
        removeData('blogPost-object'),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.STATUS_UPDATED }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
