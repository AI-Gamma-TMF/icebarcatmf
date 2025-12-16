import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

// Validation schema
const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: 'integer' },
    faqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: ['string', 'null'] },
          answer: { type: ['string', 'null'] }
        },
        required: ['question', 'answer']
      }
    }
  },
  required: ['gamePageId', 'faqs']
}

const constraints = ajv.compile(schema)

export class CreateGamePageFaqService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { GamePageFaq: GamePagesFaqModel }, sequelizeTransaction: transaction } = this.context
    const { gamePageId, faqs } = this.args

    try {
      // Fetch existing questions for this gamePageId
      const existingFaqs = await GamePagesFaqModel.findAll({
        where: {
          gamePageId,
          [Op.or]: faqs.map(f => ({ question: f.question, answer: f.answer }))
        }
      })

      const existingMap = new Set(
        existingFaqs.map(f => `${f.question}-${f.answer}`)
      )

      const faqsToInsert = faqs
        .filter(f => !existingMap.has(`${f.question}-${f.answer}`))
        .map(f => ({
          question: f.question,
          answer: f.answer,
          gamePageId
        }))

      if (!faqsToInsert.length) {
        return this.addError('FaqExistsErrorType')
      }

      await Promise.all([
        GamePagesFaqModel.bulkCreate(faqsToInsert, { transaction }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
