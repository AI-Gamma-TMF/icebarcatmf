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
    title: { type: 'string' },
    heading: { type: 'string' },
    slug: { type: 'string' },
    htmlContent: { type: 'string' },
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    schema: { type: 'string' },
    endContent: { type: ['string', 'null'] },
    isActive: { type: 'boolean' },
    imageMeta: {
      type: ['string', 'array', 'null'],
      items: {
        type: 'object',
        properties: {
          caption: { type: 'string' },
          altTag: { type: 'string' }
        },
        required: ['caption', 'altTag']
      }
    }
  },
  required: ['slug']
}

const constraints = ajv.compile(schema)

export class CreateGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePages: GamePagesModel },
      sequelizeTransaction: transaction
    } = this.context

    let {
      title,
      heading,
      slug,
      htmlContent,
      endContent,
      isActive,
      schema,
      imageMeta,
      metaTitle,
      metaDescription
    } = this.args

    // Handle multipart key pairs like imageMeta[][caption] and imageMeta[][altTag]
    const body = this.context.req.body

    const captionList = body['imageMeta[][caption]']
    const altTagList = body['imageMeta[][altTag]']

    if (!imageMeta && captionList && altTagList) {
      const captions = Array.isArray(captionList) ? captionList : [captionList]
      const altTags = Array.isArray(altTagList) ? altTagList : [altTagList]

      imageMeta = captions.map((caption, i) => ({
        caption,
        altTag: altTags[i] || ''
      }))
      this.args.imageMeta = imageMeta
    }

    // Handle imageMeta sent as stringified JSON (fallback for frontend support)
    if (typeof imageMeta === 'string') {
      try {
        imageMeta = JSON.parse(imageMeta)
        this.args.imageMeta = imageMeta
      } catch (err) {
        return this.addError('ValidationError', 'Invalid JSON format in imageMeta')
      }
    }

    const uploadedImages = this.context.req.files?.['image[]'] || []

    try {
      const isExist = await GamePagesModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { slug },
        transaction
      })

      if (isExist) return this.addError('GamePageAlreadyExistErrorType')

      const newGamePage = await GamePagesModel.create({
        title,
        heading,
        slug,
        htmlContent,
        endContent,
        isActive,
        schema,
        metaTitle,
        metaDescription
      }, { transaction })

      // Upload and map image metadata
      if (uploadedImages.length) {
        const imageArray = await Promise.all(uploadedImages.map(async (file, index) => {
          const ext = file.mimetype.split('/')[1]
          const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.GAME_PAGE}/${newGamePage.gamePageId}-${Date.now()}-${index}.${ext}`

          await uploadFile(file, fileName)

          return {
            imageUrl: prepareImageUrl(fileName),
            caption: imageMeta?.[index]?.caption || '',
            altTag: imageMeta?.[index]?.altTag || ''
          }
        }))

        await GamePagesModel.update(
          { image: imageArray },
          {
            where: { gamePageId: newGamePage.gamePageId },
            transaction
          }
        )
      }

      // Clear cache
      await Promise.all([
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
