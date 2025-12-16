import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne, updateEntity } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { jobScheduler } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    language: { type: 'string' },
    templateCode: { type: 'string' },
    emailTemplateId: { type: 'number' },
    dynamicData: { type: 'array' }
  },
  required: ['label', 'dynamicData', 'emailTemplateId', 'templateCode', 'language']
}

const constraints = ajv.compile(schema)

export class UpdateEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { label, dynamicData, templateCode, emailTemplateId, language } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      const checkTemplateExists = await getOne({ model: db.EmailTemplate, data: { ...query, emailTemplateId }, transaction })
      if (!checkTemplateExists) return this.addError('EmailTemplateNotFoundErrorType')

      const newTemplateCode = checkTemplateExists.templateCode
      newTemplateCode[language] = templateCode

      const templateData = { label, dynamicData, templateCode: newTemplateCode }
      const emailTemplate = await updateEntity({
        model: db.EmailTemplate,
        values: { emailTemplateId },
        data: templateData,
        transaction: transaction
      })
      jobScheduler(emailTemplateId)
      return { emailTemplate, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
