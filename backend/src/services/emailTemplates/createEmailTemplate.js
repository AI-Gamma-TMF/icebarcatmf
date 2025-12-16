import ServiceBase from '../../libs/serviceBase'
import db from '../../db/models'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { createNewEntity, getOne } from '../../utils/crud'
import { defaultLanguage, EmailTemplateJobStatus } from '../../utils/constants/constant'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    subject: { type: 'string' },
    language: { type: 'string' },
    templateCode: { type: 'string' },
    scheduledAt: { type: 'string' },
    templateEmailCategoryId: { type: 'number' },
    dynamicData: { type: 'array' }
  },
  required: ['subject', 'dynamicData', 'templateEmailCategoryId', 'templateCode', 'scheduledAt']
}

const constraints = ajv.compile(schema)

export class CreateEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.context.req.body
    const { subject, dynamicData, templateCode, templateEmailCategoryId, language = defaultLanguage, scheduledAt } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const isCompleteObj = [EmailTemplateJobStatus.complete, EmailTemplateJobStatus.fail]
      const isEmailTemplate = await getOne({
        model: db.EmailTemplate,
        data: {
          templateEmailCategoryId,
          actionEmailType: 'manual',
          label: { [Op.iLike]: `${subject}` },
          isComplete: { [Op.notIn]: isCompleteObj }
        }
      })
      if (isEmailTemplate) {
        return (this.addError('EmailTemplateExistsErrorType'))
      }
      const newTemplateCode = {}
      newTemplateCode[language] = templateCode
      const templateData = {
        label: subject,
        adminId: id,
        isPrimary: 0,
        dynamicData,
        templateCode: newTemplateCode,
        templateEmailCategoryId,
        scheduledAt,
        isComplete: EmailTemplateJobStatus.initiate,
        actionEmailType: 'manual'
      }

      await createNewEntity({
        model: db.EmailTemplate,
        data: templateData,
        transaction
      })
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
