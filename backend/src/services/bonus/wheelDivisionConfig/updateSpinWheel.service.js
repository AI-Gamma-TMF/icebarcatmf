import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import ajv from '../../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    wheelDivisionId: { type: 'string' },
    sc: { type: 'number', minimum: 0 },
    gc: { type: 'number', minimum: 0 },
    isAllow: { type: 'boolean' },
    playerLimit: { type: ['integer', 'null'] },
    priority: { type: 'integer' }
  },
  required: ['wheelDivisionId']
}

const constraints = ajv.compile(schema)

export class UpdateSpinWheelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { WheelDivisionConfiguration: WheelDivisionConfigurationModel },
      sequelizeTransaction: transaction
    } = this.context

    let { wheelDivisionId, sc, gc, priority, isAllow, playerLimit } = this.args

    const checkWheelConfigExists = await WheelDivisionConfigurationModel.findOne({
      where: { wheelDivisionId }
    })

    if (!checkWheelConfigExists) return this.addError('NotFoundErrorType')

    if (Number(wheelDivisionId) === 1) {
      await WheelDivisionConfigurationModel.update({ sc, gc, priority },
        {
          where: { wheelDivisionId },
          data: { sc, gc, priority },
          transaction
        })
    } else {
      if (playerLimit === '') {
        playerLimit = null
      }
      await WheelDivisionConfigurationModel.update(
        { wheelDivisionId, sc, gc, isAllow, playerLimit, priority },
        {
          where: { wheelDivisionId },
          transaction
        })
    }

    return { wheelDivisionId: wheelDivisionId, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
