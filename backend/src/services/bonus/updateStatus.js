import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity } from '../../utils/crud'
const schema = {
  type: 'object',
  properties: {
    bonusId: { type: 'number' },
    isActive: { enum: [true, false] }

  },
  required: ['bonusId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateStatusBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      bonusId,
      isActive
    } = this.args
    const {
      Bonus: BonusModel
    } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    if (bonusId <= 0) {
      return this.addError('InvalidIdErrorType')
    }
    const isBonusExist = await getOne({
      model: BonusModel,
      data: { bonusId: bonusId }
    })

    if (!isBonusExist) {
      return this.addError('BonusNotExistErrorType')
    }
    await updateEntity({
      model: BonusModel,
      values: { bonusId: bonusId },
      data: { isActive: isActive },
      transaction
    })
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
