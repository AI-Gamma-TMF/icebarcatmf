import ServiceBase from '../../libs/serviceBase'
import { setEmailKeyDescription } from '../../libs/email'
import { EMAIL_DYNAMIC_OPTIONS, EMAIL_TEMPLATES_KEYS, EMAIL_TEMPLATE_TYPES, EMAIL_TEMPLATES } from '../../utils/constants/constant'

export class GetEmailDynamicDetails extends ServiceBase {
  async run () {
    try {
      return {
        emailTypes: EMAIL_TEMPLATE_TYPES,
        dynamicKeys: EMAIL_TEMPLATES_KEYS,
        keyDescription: setEmailKeyDescription(EMAIL_DYNAMIC_OPTIONS),
        EmailTemplate: EMAIL_TEMPLATES
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
