import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    questionnaireId: { type: ['string', 'number'] }
  },
  required: ['questionnaireId']
}
const constraints = ajv.compile(schema)

export class DeleteQuestionnaireService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { questionnaireId } = this.args
    const {
      dbModels: { Questionnaire: QuestionnaireModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const questionnaireExist = await QuestionnaireModel.findOne({ where: { questionnaireId } })

      if (!questionnaireExist) return this.addError('QuestionnaireNotFoundErrorType')

      await QuestionnaireModel.update(
        {
          deletedAt: new Date(),
          isActive: false
        },
        { where: { questionnaireId }, transaction }
      )
      return { message: SUCCESS_MSG.DELETE_SUCCESS, success: true }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
