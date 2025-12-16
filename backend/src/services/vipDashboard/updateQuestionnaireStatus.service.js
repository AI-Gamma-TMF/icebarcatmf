import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    questionnaireId: { type: ['string', 'number'] },
    isActive: { type: ['boolean'] }
  },
  required: ['questionnaireId', 'isActive']
}
const constraints = ajv.compile(schema)
export class UpdateQuestionnaireStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Questionnaire: QuestionnaireModel },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const { questionnaireId, isActive } = this.args

      const questionnaire = await QuestionnaireModel.findOne({
        where: { questionnaireId }
      })

      if (!questionnaire) {
        return this.addError('QuestionnaireNotFoundErrorType')
      }

      await QuestionnaireModel.update(
        {
          isActive
        },
        {
          where: { questionnaireId },
          transaction
        }
      )

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
