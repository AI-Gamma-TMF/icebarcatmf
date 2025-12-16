import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllEmailCenterTemplateService extends ServiceBase {
  async run () {
    const {
      dbModels: { EmailTemplates: EmailTemplatesModel },
      sequelizeTransaction: transaction
    } = this.context

    const {
      orderBy,
      pageNo,
      limit,
      sort,
      emailTemplateId = '',
      isActive = ''
    } = this.args
    let query = {}
    let templateList
    try {
      if (emailTemplateId) query = { ...query, emailTemplateId }
      if (isActive && isActive !== 'all') query = { ...query, isActive }

      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)
        templateList = await EmailTemplatesModel.findAndCountAll({
          attributes: { exclude: ['moreDetails', 'createdAt', 'updatedAt'] },
          where: { ...query },
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'emailTemplateId', sort || 'ASC']],
          transaction
        })
      } else {
        templateList = await EmailTemplatesModel.findAndCountAll({
          attributes: { exclude: ['moreDetails', 'createdAt', 'updatedAt'] },
          where: query,
          transaction
        })
      }

      if (!templateList) return this.addError('EmailTemplateNotFoundErrorType')
      return { templateList, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN GET EMAIL CENTER TEMPLATE')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
