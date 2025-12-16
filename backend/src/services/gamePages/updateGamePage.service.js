import sequelize, { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl, removeData, uploadFile } from '../../utils/common'
import config from '../../configs/app.config'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

// Updated schema
const schema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    heading: { type: 'string' },
    slug: { type: 'string' },
    htmlContent: { type: 'string' },
    endContent: { type: ['string', 'null'] },
    schema: { type: 'string' },
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    isActive: { type: 'boolean' },
    gamePageId: { type: ['string', 'number'] },
    imageMeta: {
      type: ['array', 'null'],
      items: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string' },
          caption: { type: 'string' },
          altTag: { type: 'string' },
          isUpdateImage: { type: 'boolean' },
          isDeleteImage: { type: 'boolean' }
        }
      }
    },
    isClearImage: { type: ['boolean', 'null'] }
  },
  required: ['gamePageId']
}

const constraints = ajv.compile(schema)

export class UpdateGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePages: GamePagesModel },
      sequelizeTransaction: transaction
    } = this.context

    const { title, heading, htmlContent, slug, endContent, gamePageId, isActive, isClearImage, schema, metaTitle, metaDescription } = this.args
    let { imageMeta } = this.args

    const uploadedImages = this.context.req.files?.['image[]'] || []
    const body = this.context.req.body

    // Parse multipart form fallback
    const captionList = body['imageMeta[][caption]']
    const altTagList = body['imageMeta[][altTag]']
    const isUpdateImageList = body['imageMeta[][isUpdateImage]']
    const imageUrlList = body['imageMeta[][imageUrl]']

    if (!imageMeta && captionList && altTagList) {
      const captions = Array.isArray(captionList) ? captionList : [captionList]
      const altTags = Array.isArray(altTagList) ? altTagList : [altTagList]
      const imageUrls = imageUrlList ? (Array.isArray(imageUrlList) ? imageUrlList : [imageUrlList]) : []
      const isUpdateImages = isUpdateImageList ? (Array.isArray(isUpdateImageList) ? isUpdateImageList : [isUpdateImageList]) : []

      imageMeta = captions.map((caption, i) => {
        const obj = {
          caption,
          altTag: altTags[i] || ''
        }

        if (imageUrls[i]) {
          obj.imageUrl = imageUrls[i]
        }

        if (isUpdateImages[i] !== undefined) {
          obj.isUpdateImage = isUpdateImages[i] === 'true' || isUpdateImages[i] === true
        }

        return obj
      })

      this.args.imageMeta = imageMeta
    }

    // Parse stringified JSON imageMeta
    if (typeof imageMeta === 'string') {
      try {
        imageMeta = JSON.parse(imageMeta)
        this.args.imageMeta = imageMeta
      } catch (err) {
        return this.addError('ValidationError', 'Invalid JSON format in imageMeta')
      }
    }

    try {
      const isExist = await GamePagesModel.findOne({
        where: { gamePageId },
        transaction
      })

      if (!isExist) return this.addError('GamePageNotFoundErrorType')

      if (slug) {
        const isSlugDuplicate = await GamePagesModel.findOne({
          attributes: [[sequelize.literal('1'), 'exists']],
          where: {
            slug,
            gamePageId: { [Op.ne]: gamePageId }
          },
          transaction
        })

        if (isSlugDuplicate) return this.addError('GamePageAlreadyExistErrorType')
      }

      const updatedObj = { title, heading, htmlContent, slug, endContent, isActive, schema, metaTitle, metaDescription }

      let finalImages = []

      // Handle existing image updates and deletions
      if (Array.isArray(imageMeta)) {
        for (const img of imageMeta) {
          if (img.isDeleteImage) continue // skip deleted images
          if (img.isUpdateImage && img.imageUrl) {
            finalImages.push({
              imageUrl: img.imageUrl,
              caption: img.caption || '',
              altTag: img.altTag || ''
            })
          }
        }
      }

      // 2. Handle new uploads and map to remaining imageMeta items without imageUrl
      if (uploadedImages.length) {
        const metaWithoutImageUrl = imageMeta.filter(img => !img.imageUrl && !img.isUpdateImage)

        const newImages = await Promise.all(uploadedImages.map(async (file, index) => {
          const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.GAME_PAGE}/${gamePageId}-${Date.now()}-${index}.${file.mimetype.split('/')[1]}`
          await uploadFile(file, fileName)

          const meta = metaWithoutImageUrl[index] || {}

          return {
            imageUrl: prepareImageUrl(fileName),
            caption: meta.caption || '',
            altTag: meta.altTag || ''
          }
        }))

        finalImages = [...finalImages, ...newImages]
      }

      // If clear flag is passed, override all
      if (isClearImage) {
        updatedObj.image = []
      } else if (finalImages.length) {
        updatedObj.image = finalImages
      }

      await Promise.all([
        GamePagesModel.update(updatedObj, { where: { gamePageId }, transaction }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
