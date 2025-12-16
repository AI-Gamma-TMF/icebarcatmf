import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
}

const constraints = ajv.compile(schema)
export class OrderQuestionnaireService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Questionnaire: QuestionnaireModel },
      sequelizeTransaction: transaction
    } = this.context

    const { order } = this.args
    try {
      const promises = order.map(async (id, index) => {
        const checkExists = await QuestionnaireModel.findOne({ where: { questionnaireId: id }, transaction })
        if (checkExists) await QuestionnaireModel.update({ orderId: index + 1 }, { where: { questionnaireId: id }, transaction })
      })

      await Promise.all(promises)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
