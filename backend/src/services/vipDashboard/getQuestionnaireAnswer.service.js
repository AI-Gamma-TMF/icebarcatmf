import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { QUESTIONNAIRE_QUESTION_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    answer: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    questionnaireId: { type: ['string', 'null'] }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetQuestionnaireAnswerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Questionnaire: QuestionnaireModel, UserQuestionnaireAnswer: UserQuestionnaireAnswerModel }
    } = this.context
    const { userId } = this.args

    // 1. Fetch all active questions
    const questions = await QuestionnaireModel.findAll({
      order: [['questionnaireId', 'ASC']],
      attributes: ['questionnaireId', 'options', 'questionType', 'isActive', 'question']
    })

    // 2. Fetch all user's answers
    const answers = await UserQuestionnaireAnswerModel.findAll({
      where: { userId: userId ? +userId : null }
    })

    const answersMap = new Map()
    answers.forEach((a) => {
      answersMap.set(a.questionnaireId, a.answer)
    })

    // 3. Construct full response
    const result = questions.map((q) => {
      const answer = answersMap.get(q.questionnaireId)
      const options = q.options || null
      const questionType = q.questionType
      let readableAnswer = null

      if (answer !== undefined) {
        if (questionType === QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE) {
          const selected = options.find(opt => opt.id === answer.selectedOptionId)
          readableAnswer = selected?.text ?? null
        } else if (questionType === QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE) {
          readableAnswer = (answer.selectedOptionIds || [])
            .map(id => options.find(o => o.id === id)?.text)
            .filter(Boolean)
        } else if (questionType === QUESTIONNAIRE_QUESTION_TYPE.SEQUENCE) {
          readableAnswer = (answer.orderedOptionIds || [])
            .map(id => options.find(o => o.id === id)?.text)
            .filter(Boolean)
        } else {
          readableAnswer = answer
        }
      }

      return {
        questionId: q.questionnaireId,
        isActiveQuestion: q.isActive,
        // isDeletedQuestion: q.deletedAt,
        questionText: q.question,
        questionType: questionType,
        options,
        answered: answer !== undefined,
        rawAnswer: answer ?? null,
        readableAnswer: readableAnswer
      }
    })

    return {
      data: result,
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
