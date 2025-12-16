import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: ['string', 'number'] }
  },
  required: ['gamePageId']
}

const constraints = ajv.compile(schema)

export class DeleteGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePages: GamePagesModel },
      sequelizeTransaction: transaction
    } = this.context

    const { gamePageId } = this.args

    try {
      const isExist = await GamePagesModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { gamePageId }
      })

      if (!isExist) return this.addError('GamePageNotFoundErrorType')

      await Promise.all([
        GamePagesModel.destroy({
          where: { gamePageId },
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
