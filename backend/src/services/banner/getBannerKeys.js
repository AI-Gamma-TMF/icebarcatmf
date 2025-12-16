import ServiceBase from '../../libs/serviceBase'
import { BANNER_KEYS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetBannerKeys extends ServiceBase {
  async run () {
    try {
      return { bannerKey: BANNER_KEYS, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
