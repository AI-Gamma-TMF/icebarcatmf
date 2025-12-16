import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { EMAIL_TEMPLATE_PRIMARY_STATUS, EmailTemplateJobStatus } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'number' }
  },
  required: ['emailTemplateId']
}

const constraints = ajv.compile(schema)

export class DeleteEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { emailTemplateId } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      query = { emailTemplateId }

      const emailTemplate = await getOne({ model: db.EmailTemplate, data: query, transaction })
      if (!emailTemplate) return this.addError('EmailTemplateNotFoundErrorType')

      if (emailTemplate.isPrimary === EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY) {
        return this.addError('PrimaryEmailErrorType')
      }
      if (emailTemplate.isComplete === EmailTemplateJobStatus.complete) {
        return this.addError('ActionNotAllowedErrorType')
      }

      await emailTemplate.destroy({ transaction })
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
