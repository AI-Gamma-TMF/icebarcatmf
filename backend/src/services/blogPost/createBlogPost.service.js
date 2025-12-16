import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl, removeData, uploadFile } from '../../utils/common'
import config from '../../configs/app.config'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    slug: { type: 'string' },
    postHeading: { type: 'string' },
    bannerImageAlt: { type: ['string', 'null'] },
    contentBody: { type: 'string' },
    isActive: { type: 'boolean' },
    isPopularBlog: { type: 'boolean' },
    bannerImageUrl: { type: ['object', 'null'] },
    gamePageIds: { type: ['array', 'null'] },
    schema: { type: 'string' }
  },
  required: ['slug']
}

const constraints = ajv.compile(schema)

export class CreateBlogPostService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlogPost: BlogPostModel, BlogPostGamePage: BlogPostGamePageModel },
      sequelizeTransaction: transaction
    } = this.context

    const { metaTitle, metaDescription, slug, postHeading, bannerImageAlt, contentBody, isActive, isPopularBlog, bannerImageUrl, gamePageIds, schema } = this.args
    try {
      const isExist = await BlogPostModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { slug },
        transaction
      })

      if (isExist) return this.addError('BlogPostAlreadyExistErrorType')

      let query = {
        metaTitle,
        metaDescription,
        slug,
        postHeading,
        contentBody,
        isActive,
        isPopularBlog,
        schema
      }

      if (bannerImageAlt) query = { ...query, bannerImageAlt }

      const newBlogPost = await BlogPostModel.create(query, { transaction })

      let blogPostGamePageRecords = []

      if (Array.isArray(gamePageIds) && gamePageIds.length > 0) {
        blogPostGamePageRecords = gamePageIds.map(gamePageId => ({
          gamePageId,
          blogPostId: newBlogPost.blogPostId
        }))
      }

      if (blogPostGamePageRecords.length > 0) {
        await BlogPostGamePageModel.bulkCreate(blogPostGamePageRecords, { transaction })
      }

      if (bannerImageUrl && typeof bannerImageUrl === 'object') {
        const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.BANNER}/${newBlogPost.blogPostId}-${Date.now()}.${bannerImageUrl.mimetype.split('/')[1]}`

        await Promise.all([
          uploadFile(bannerImageUrl, fileName),

          BlogPostModel.update({
            bannerImageUrl: prepareImageUrl(fileName)
          }, {
            where: { blogPostId: +newBlogPost.blogPostId },
            transaction
          }),
          removeData('blogPost-array'),
          removeData('blogPost-object'),
          removeData('gamePage-array'),
          removeData('gamePage-object')
        ])
      }

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
