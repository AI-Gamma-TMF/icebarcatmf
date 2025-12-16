import ServiceBase from '../../libs/serviceBase'
import { setEmailKeyDescription } from '../../libs/email'
import { CMS_DYNAMIC_OPTIONS, CMS_ALLOWED_KEYS } from '../../utils/constants/constant'

export class GetCmsDynamicKeys extends ServiceBase {
  async run () {
    try {
      return { dynamicKeys: CMS_ALLOWED_KEYS, keyDescription: setEmailKeyDescription(CMS_DYNAMIC_OPTIONS) }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
