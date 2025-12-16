import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    questionnaireId: { type: ['number', 'string'] },
    question: { type: ['string', 'null'] },
    isActive: { type: ['boolean', 'null'] },
    questionType: { type: ['string', 'null'] },
    options: { type: 'array' },
    required: { type: ['boolean', 'null'] },
    frontendQuestionType: { type: ['string', 'null'] },
    type: { type: ['string', 'null'] },
    min: { type: ['string', 'number', 'null'] },
    max: { type: ['string', 'number', 'null'] }
  },
  required: ['questionnaireId', 'question', 'questionType']
}

const constraints = ajv.compile(schema)

export class UpdateQuestionnaireService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        Questionnaire: QuestionnaireModel,
        UserQuestionnaireAnswer: UserQuestionnaireAnswerModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      questionnaireId,
      question,
      isActive,
      questionType,
      options,
      required,
      frontendQuestionType,
      type,
      min,
      max
    } = this.args

    try {
      const [existing, hasBeenAnswered] = await Promise.all([
        QuestionnaireModel.findOne({ where: { questionnaireId } }),
        UserQuestionnaireAnswerModel.findOne({ where: { questionnaireId } })
      ])

      if (!existing) {
        return this.addError('QuestionnaireNotFoundErrorType')
      }

      if (hasBeenAnswered) {
        return this.addError('QuestionAlreadyAnsweredErrorType')
      }

      await QuestionnaireModel.update(
        {
          question,
          questionType,
          options,
          required: required ?? false,
          isActive: isActive ?? true,
          frontendQuestionType,
          moreDetails: { type, min, max }
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
      this.addError('InternalServerErrorType', error)
    }
  }
}
