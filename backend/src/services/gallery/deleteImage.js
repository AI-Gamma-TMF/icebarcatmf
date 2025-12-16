import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE } from '../../utils/constants/constant'
import { removeByAttr, removeLogo } from '../../utils/common'
import { updateEntity } from '../../utils/crud'
import ajv from '../../libs/ajv'
const schema = {
  type: 'object',
  properties: {
    imageUrl: {
      type: 'string'
    }
  },
  required: ['imageUrl']
}

const constraints = ajv.compile(schema)
export class DeleteImage extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: {
        user: {
          userType
        }
      },
      dbModels: {
        GlobalSetting: GlobalSettingModel
      },
      sequelizeTransaction: t
    } = this.context

    let { imageUrl } = this.args
    let gallery
    if (userType === ROLE.ADMIN) {
      gallery = JSON.parse((await GlobalSettingModel.findOne({
        attributes: ['key', 'value'],
        where: { key: 'ADMIN_GALLERY' },
        raw: true
      })).value)
      if (imageUrl.indexOf('https://') !== -1) {
        imageUrl = imageUrl.split('/').slice(3).join('/')
      }
      if (!(gallery.some((imageObj) => imageObj.imageUrl === imageUrl))) {
        return this.addError('ImageUrlNotFoundErrorType')
      }

      await removeLogo(imageUrl)

      const newGallery = removeByAttr(gallery, 'imageUrl', imageUrl)

      await updateEntity({
        model: GlobalSettingModel,
        values: { key: 'ADMIN_GALLERY' },
        data: { value: JSON.stringify(newGallery) },
        transaction: t
      })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    }
    return this.addError('FailedToDeleteImageErrorType')
  }
}
