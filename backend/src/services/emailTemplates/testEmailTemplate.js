import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { insertDynamicDataInTemplate, sendEmailMailjet } from '../../libs/email'
import { defaultBase64, defaultUtf8, EMAIL_TEMPLATE_TYPES } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    dynamicData: { type: 'object' },
    templateCode: { type: 'string' },
    testEmail: { type: 'string', format: 'email' }
  },
  required: ['userType', 'templateCode', 'testEmail', 'dynamicData']
}

const constraints = ajv.compile(schema)

export class TestEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { templateCode, testEmail, dynamicData } = this.args
    try {
      const emailBodyRaw = insertDynamicDataInTemplate({ template: Buffer.from(templateCode, defaultBase64).toString(defaultUtf8), dynamicData })

      const mailSent = await sendEmailMailjet({ emailTemplate: emailBodyRaw, email: testEmail, name: 'test', subject: EMAIL_TEMPLATE_TYPES.EMAIL_VERIFICATION })

      if (!mailSent.success) {
        return this.addError('SendEmailError')
      }
      return { success: true, message: SUCCESS_MSG.EMAIL_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
