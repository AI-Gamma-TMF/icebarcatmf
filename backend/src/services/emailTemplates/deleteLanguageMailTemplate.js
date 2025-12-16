import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { defaultLanguage } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    language: { type: 'string' },
    emailTemplateId: { type: 'number' }
  },
  required: ['emailTemplateId', 'language']
}

const constraints = ajv.compile(schema)

export class DeleteEmailTemplateLanguageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { emailTemplateId, language } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      query = { emailTemplateId }
      const emailTemplate = await getOne({ model: db.EmailTemplate, data: query, transaction })
      if (!emailTemplate) return this.addError('EmailTemplateNotFoundErrorType')

      if (language === defaultLanguage) return this.addError('PrimaryEmailErrorType')

      delete emailTemplate.templateCode[language]
      await emailTemplate.set({ templateCode: emailTemplate.templateCode }).save({ transaction })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
