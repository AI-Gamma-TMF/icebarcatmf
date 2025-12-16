import ServiceBase from '../../libs/serviceBase'
import { notifyUserByEmailJobScheduler } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class SendUserEmailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        EmailTemplates: EmailTemplatesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { emailTemplateId, userData } = this.args
    try {
      const checkTemplateExists = await EmailTemplatesModel.findOne({
        where: { emailTemplateId: +emailTemplateId },
        transaction,
        raw: true
      })
      if (!checkTemplateExists) {
        return this.addError('EmailTemplateNotFoundErrorType')
      }
      const emails = userData.map(user => user.email)
      if (!emails.length) {
        return this.addError('RequestInputValidationErrorType')
      }
      await notifyUserByEmailJobScheduler({
        usersEmail: emails,
        emailTemplateId: +emailTemplateId
      })
      return { success: true, message: SUCCESS_MSG.EMAIL_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN SendUserEmailService')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
