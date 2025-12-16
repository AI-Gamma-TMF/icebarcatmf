import ServiceBase from '../../libs/serviceBase'
import { TEMPLATE_CATEGORY } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetFreeSpinTemplates extends ServiceBase {
  async run () {
    const {
      dbModels: { EmailTemplates: EmailTemplatesModel }
    } = this.context

    const { templateType } = this.args
    let templateList
    try {
      if (Object.values(TEMPLATE_CATEGORY).includes(templateType)) {
        templateList = await EmailTemplatesModel.findAll({
          attributes: ['emailTemplateId', 'templateName'],
          where: {
            isActive: true,
            templateType: templateType
          }
        })
      } else {
        templateList = await EmailTemplatesModel.findAll({
          attributes: ['emailTemplateId', 'templateName'],
          where: {
            isActive: true
          }
        })
      }
      return { templateList, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN GetFreeSpinTemplate')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
