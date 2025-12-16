import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { createEmailTemplateData } from '../../libs/email'
import { EMAIL_TEMPLATE_ORDER } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetAllEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Todo wil Use this line - const { } = this.args
    try {
      const emailTemplate = await db.EmailTemplate.findAll()
      const allTemplate = createEmailTemplateData(emailTemplate)
      allTemplate.Manual = { ...allTemplate.undefined }
      delete allTemplate.undefined
      return (!emailTemplate)
        ? this.addError('EmailTemplateNotFoundErrorType')
        : {
            templateCount: emailTemplate.length,
            emailTemplateOrder: EMAIL_TEMPLATE_ORDER,
            emailTemplate: allTemplate
          }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
