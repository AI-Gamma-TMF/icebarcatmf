import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteEmailCenterTemplateService extends ServiceBase {
  async run () {
    const {
      dbModels: { EmailTemplates: EmailTemplatesModel },
      sequelizeTransaction: transaction
    } = this.context

    const { emailTemplateId } = this.args
    try {
      const checkTemplateExists = await EmailTemplatesModel.findOne({
        where: { emailTemplateId },
        transaction,
        raw: true
      })

      if (!checkTemplateExists) {
        return this.addError('EmailTemplateNotFoundErrorType')
      }

      await EmailTemplatesModel.destroy({ where: { emailTemplateId }, transaction })
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN DELETE EMAIL CENTER TEMPLATE')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
