import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string' }
  },
  required: ['emailTemplateId']
}

const constraints = ajv.compile(schema)

export class GetEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { emailTemplateId } = this.args
    let query

    try {
      if (!+(emailTemplateId)) {
        return this.addError('RequestInputValidationErrorType')
      }
      query = { emailTemplateId }
      const emailTemplate = await getOne({ model: db.EmailTemplate, data: query })

      return (!emailTemplate) ? this.addError('EmailTemplateNotFoundErrorType') : { emailTemplate, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
