import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    answer: { type: ['string'] },
    userId: { type: ['string'] },
    questionnaireId: { type: ['string'] }
  },
  required: ['answer', 'userId', 'questionnaireId']
}
const constraints = ajv.compile(schema)

export class CreateQuestionnaireAnswerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { UserQuestionnaireAnswer: UserQuestionnaireAnswerModel },
      sequelizeTransaction: transaction
    } = this.context
    const { answer, userId, questionnaireId } = this.args

    try {
      const questionAnswerRecord = await UserQuestionnaireAnswerModel.findOne({
        where: { userId, questionnaireId }
      })

      if (questionAnswerRecord) {
        await questionAnswerRecord.update({ answer }, { transaction })
        return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
      } else {
        await UserQuestionnaireAnswerModel.create(
          { answer, userId, questionnaireId },
          { transaction }
        )
        return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
