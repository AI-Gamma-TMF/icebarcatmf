import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    questionnaireId: { type: ['string', 'null'] },
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'], enum: ['true', 'false', 'all'] }
  },
  required: []
}
const constraints = ajv.compile(schema)

export class GetQuestionnaireService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Questionnaire: QuestionnaireModel }
    } = this.context
    const { questionnaireId, limit, pageNo, sort, orderBy, search, isActive } = this.args

    let query = {}
    let questions
    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (questionnaireId) query = { questionnaireId: questionnaireId }
      if (search) { query = { ...query, question: { [Op.iLike]: `%${search}%` } } }
      if (isActive && isActive !== 'all') query = { ...query, isActive }
      if (limit && pageNo) {
        questions = await QuestionnaireModel.findAndCountAll({
          order: [[orderBy || 'orderId', sort || 'ASC']],
          attributes: ['questionnaireId', 'question', 'isActive', 'questionType', 'options', 'required', 'moreDetails', 'frontendQuestionType', 'orderId'],
          where: query,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        questions = await QuestionnaireModel.findAndCountAll({
          order: [[orderBy || 'orderId', sort || 'ASC']],
          attributes: ['questionnaireId', 'question', 'isActive', 'questionType', 'options', 'required', 'moreDetails', 'frontendQuestionType', 'orderId'],
          where: query
        })
      }

      return {
        questions,
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
