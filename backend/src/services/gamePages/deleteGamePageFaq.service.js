import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

// Validation schema
const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: ['integer', 'string'] },
    gamePageFaqId: { type: ['integer', 'string'] }
  },
  required: ['gamePageId', 'gamePageFaqId']
}

const constraints = ajv.compile(schema)

export class DeleteGamePageFaqService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { gamePageId, gamePageFaqId } = this.args
    const {
      dbModels: { GamePageFaq: GamePagesFaqModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const faq = await GamePagesFaqModel.findOne({
        where: { gamePageId, gamePageFaqId }
      })

      if (!faq) {
        return this.addError('GamePageFaqNotFoundErrorType')
      }

      await Promise.all([
        GamePagesFaqModel.destroy({
          where: { gamePageId, gamePageFaqId },
          transaction
        }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
