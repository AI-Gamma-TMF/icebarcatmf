import sequelize, { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl, removeData, uploadFile } from '../../utils/common'
import config from '../../configs/app.config'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    blogPostId: { type: 'number' },
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    slug: { type: 'string' },
    postHeading: { type: 'string' },
    bannerImageUrl: { type: ['object', 'null'] },
    bannerImageAlt: { type: ['string', 'null'] },
    contentBody: { type: 'string' },
    isActive: { type: 'boolean' },
    isPopularBlog: { type: 'boolean' },
    gamePageIds: { type: ['array', 'null'] },
    schema: { type: 'string' }
  },
  required: ['blogPostId']
}

const constraints = ajv.compile(schema)

export class UpdateBlogPostService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPost: BlogPostModel, BlogPostGamePage: BlogPostGamePageModel },
      sequelizeTransaction: transaction
    } = this.context

    const { blogPostId, metaTitle, metaDescription, slug, postHeading, bannerImageUrl, bannerImageAlt, contentBody, isActive, isPopularBlog, gamePageIds, schema } = this.args
    try {
      const isExist = await BlogPostModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { blogPostId },
        transaction
      })

      if (!isExist) return this.addError('BlogPostNotFoundErrorType')

      const isBlogPostExist = await BlogPostModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: {
          slug,
          blogPostId: { [Op.ne]: blogPostId }
        },
        transaction
      })

      if (isBlogPostExist) return this.addError('BlogPostAlreadyExistErrorType')

      let updatedObj = {
        metaTitle,
        metaDescription,
        slug,
        postHeading,
        contentBody,
        isActive,
        isPopularBlog,
        schema
      }

      if (bannerImageAlt) updatedObj = { ...updatedObj, bannerImageAlt }

      if (bannerImageUrl && typeof bannerImageUrl === 'object') {
        const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.BANNER}/${blogPostId}-${Date.now()}.${bannerImageUrl.mimetype.split('/')[1]}`
        uploadFile(bannerImageUrl, fileName)
        updatedObj.bannerImageUrl = prepareImageUrl(fileName)
      }

      let blogPostGamePageRecords = []
      const shouldUpdateGamePages = Array.isArray(gamePageIds) && gamePageIds.length > 0
      if (shouldUpdateGamePages) {
        blogPostGamePageRecords = gamePageIds.map(gamePageId => ({
          gamePageId,
          blogPostId
        }))
      }

      await Promise.all([
        BlogPostModel.update(updatedObj, { where: { blogPostId }, transaction }),
        BlogPostGamePageModel.destroy({ where: { blogPostId }, transaction }),
        removeData('blogPost-array'),
        removeData('blogPost-object'),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      if (blogPostGamePageRecords.length > 0) {
        await BlogPostGamePageModel.bulkCreate(blogPostGamePageRecords, { transaction })
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
