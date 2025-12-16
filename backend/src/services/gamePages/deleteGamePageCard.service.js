import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    gamePageCardId: { type: ['string', 'number'] }
  },
  required: ['gamePageCardId']
}

const constraints = ajv.compile(schema)

export class DeleteGamePageCardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePageCards: GamePageCardsModel },
      sequelizeTransaction: transaction
    } = this.context

    const { gamePageCardId } = this.args

    try {
      const isExist = await GamePageCardsModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { gamePageCardId }
      })

      if (!isExist) return this.addError('GamePageCardNotFoundErrorType')

      await Promise.all([
        GamePageCardsModel.destroy({
          where: { gamePageCardId },
          transaction
        }),
        removeData('gamePage-array'),
        removeData('gamePage-object')
      ])

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
