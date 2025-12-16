import ServiceBase from '../../libs/serviceBase'
import { dynamicEmailTemplatesValues } from '../../utils/common'
import { TEMPLATE_CATEGORY } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

export class UpdateEmailCenterTemplateService extends ServiceBase {
  async run () {
    const {
      dbModels: { EmailTemplates: EmailTemplatesModel },
      sequelizeTransaction: transaction
    } = this.context

    const {
      emailTemplateId,
      templateName,
      subjectName,
      contentHtml,
      dynamicFields,
      isActive = true,
      templateType
    } = this.args
    try {
      const [checkTemplateExists, isTemplateExist] = await Promise.all([
        EmailTemplatesModel.findOne({
          where: { emailTemplateId: +emailTemplateId },
          transaction,
          raw: true
        }),
        EmailTemplatesModel.findOne({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  { templateName: { [Op.iLike]: `${templateName}` } },
                  { subjectName: { [Op.iLike]: `${subjectName}` } }
                ]
              },
              { emailTemplateId: { [Op.ne]: +emailTemplateId } }
            ]
          },
          transaction,
          raw: true
        })
      ])

      if (!checkTemplateExists) {
        return this.addError('EmailTemplateNotFoundErrorType')
      }
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
      const updateTemplate = {
        templateName,
        subjectName,
        contentHtml,
        dynamicFields,
        isActive
      }
      if (Object.values(TEMPLATE_CATEGORY).includes(templateType)) {
        updateTemplate.templateType = templateType
      }
      await EmailTemplatesModel.update(updateTemplate, { where: { emailTemplateId }, transaction })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      if (error.message.startsWith('ValidationError')) {
        return { success: false, status: error.status, message: error.message }
      }
      return this.addError('InternalServerErrorType', error)
    }
  }
}
