import ServiceBase from '../../libs/serviceBase'
import { dynamicEmailTemplatesValues } from '../../utils/common'
import { TEMPLATE_CATEGORY } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

export class CreateEmailCenterTemplateService extends ServiceBase {
  async run () {
    const {
      dbModels: { EmailTemplates: EmailTemplatesModel },
      sequelizeTransaction: transaction
    } = this.context

    const { templateName, subjectName, contentHtml, dynamicFields, isActive = true, templateType } = this.args
    try {
      const isTemplateExist = await EmailTemplatesModel.findOne({
        where: {
          [Op.or]: [
            { templateName: { [Op.iLike]: `${templateName}` } },
            { subjectName: { [Op.iLike]: `${subjectName}` } }
          ]
        },
        transaction,
        raw: true
      })

      if (isTemplateExist) {
        return this.addError('EmailTemplateExistsErrorType')
      }
      const dynamicFieldMapping = dynamicEmailTemplatesValues(templateType)
      const missingKeys = dynamicFields.filter(key => !(key in dynamicFieldMapping))
      if (missingKeys.length > 0) {
        const err = new Error(`ValidationError: The following keys are not applicable - ${missingKeys.join(', ')}`)
        err.status = 403
        throw err
      }
      const createTemplate = {
        templateName,
        subjectName,
        contentHtml,
        dynamicFields,
        isActive
      }

      if (Object.values(TEMPLATE_CATEGORY).includes(templateType)) {
        createTemplate.templateType = templateType
      }
      await EmailTemplatesModel.create(createTemplate, { transaction })
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      if (error.message.startsWith('ValidationError')) {
        return { success: false, status: error.status, message: error.message }
      }
      return this.addError('InternalServerErrorType', error)
    }
  }
}
