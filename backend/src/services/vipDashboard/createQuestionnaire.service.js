import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

// AJV schema to validate incoming payload
const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: ['string', 'null'] },
          questionType: { type: 'string' },
          options: { type: ['string', 'null', 'array'] },
          type: { type: ['string', 'null'] },
          required: { type: ['boolean', 'null'] },
          min: { type: ['string', 'number', 'null'] },
          max: { type: ['string', 'number', 'null'] }
        },
        required: ['question', 'questionType']
      }
    }
  },
  required: ['questions']
}

const constraints = ajv.compile(schema)

export class CreateQuestionnaireService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { Questionnaire: QuestionnaireModel }, sequelizeTransaction: transaction } = this.context
    const { questions } = this.args

    try {
      const existing = await QuestionnaireModel.findAll({
        where: {
          [Op.or]: questions.map(({ question, questionType }) => ({ question, questionType }))
        }
      })

      const existingMap = new Set(existing.map(q => `${q.question}-${q.questionType}`))

      const filteredToInsert = questions
        .filter(q => !existingMap.has(`${q.question}-${q.questionType}`))
        .map(q => ({
          question: q.question,
          questionType: q.questionType,
          options: q.options,
          required: q.required ?? false,
          frontendQuestionType: q.type,
          moreDetails: {
            min: q.min,
            max: q.max,
            type: q.type
          }
        }))

      if (!filteredToInsert.length) {
        return this.addError('QuestionnaireExistsErrorType', 'All questions already exist.')
      }

      await QuestionnaireModel.bulkCreate(filteredToInsert, { transaction })

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
