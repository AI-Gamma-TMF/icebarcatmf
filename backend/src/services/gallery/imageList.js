import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE } from '../../utils/constants/constant'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

export class GetImageList extends ServiceBase {
  async run () {
    const {
      req: {
        user: {
          userType
        }
      },
      dbModels: {
        GlobalSetting: GlobalSettingModel
      }
    } = this.context
    let galleryResult = []
    const galleryArray = []
    if (userType === ROLE.ADMIN) {
      galleryResult = JSON.parse((await GlobalSettingModel.findOne({
        attributes: ['key', 'value'],
        where: { key: 'ADMIN_GALLERY' },
        raw: true
      })).value)

      for (const galleryImages of galleryResult) {
        galleryImages.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${galleryImages.imageUrl}`
        galleryArray.push(galleryImages)
      }
    }
    return { success: true, gallery: galleryArray, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
