import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE, OK } from '../../utils/constants/constant'
import { validateFile, uploadFile } from '../../utils/common'
import { updateEntity } from '../../utils/crud'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  required: ['name']
}

const constraints = ajv.compile(schema)
export class UploadImage extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: {
        user: {
          userType
        },
        file: image
      },
      dbModels: {
        GlobalSetting: GlobalSettingModel
      },
      sequelizeTransaction: t
    } = this.context

    const { name } = this.args

    const fileCheckResponse = validateFile(null, image)
    if (fileCheckResponse !== OK) {
      this.addError(`${fileCheckResponse}`)
    }

    let imageUrl

    if (image && typeof (image) === 'object') {
      let fileName
      if (userType === ROLE.ADMIN) {
        fileName = `${process.env.NODE_ENV}/admin_gallery_image_${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${image.mimetype.split('/')[1]}`
      }

      await uploadFile(image, fileName)
      imageUrl = fileName
    }

    const galleryArray = []
    if (userType === ROLE.ADMIN) {
      const adminGallery = JSON.parse((await GlobalSettingModel.findOne({
        attributes: ['key', 'value'],
        where: { key: 'ADMIN_GALLERY' },
        raw: true,
        transaction: t
      })).value)

      adminGallery.push({
        name,
        imageUrl
      })

      await updateEntity({
        model: GlobalSettingModel,
        values: { key: 'ADMIN_GALLERY' },
        data: { value: JSON.stringify(adminGallery) },
        transaction: t
      })

      for (const galleryImages of adminGallery) {
        galleryImages.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${galleryImages.imageUrl}`
        galleryArray.push(galleryImages)
      }
    }

    return { success: true, galleryArray, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
