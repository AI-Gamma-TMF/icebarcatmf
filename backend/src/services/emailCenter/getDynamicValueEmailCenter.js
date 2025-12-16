import ServiceBase from '../../libs/serviceBase'
import { dynamicEmailTemplatesValues } from '../../utils/common'
import { TEMPLATE_CATEGORY } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetDynamicValueEmailCenterService extends ServiceBase {
  async run () {
    const { templateType } = this.args
    let dynamicEmailValues
    try {
      if (Object.values(TEMPLATE_CATEGORY).includes(templateType)) {
        dynamicEmailValues = dynamicEmailTemplatesValues(templateType)
      } else {
        dynamicEmailValues = dynamicEmailTemplatesValues()
      }
      return { dynamicEmailValues, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN GET EMAIL CENTER TEMPLATE')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
