import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne } from '../../utils/crud'
const schema = {
  type: 'object',
  properties: {
    bonusId: { type: 'string' }
  },
  required: ['bonusId']
}

const constraints = ajv.compile(schema)

export class DeleteBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      bonusId
    } = this.args
    const {
      Bonus: BonusModel
    } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    if (!(+bonusId >= 0) || bonusId === '') {
      return this.addError('InvalidIdErrorType')
    }
    const isBonusExist = await getOne({
      model: BonusModel,
      data: { bonusId: bonusId }
    })

    if (!isBonusExist) {
      return this.addError('BonusNotExistErrorType')
    }
    await BonusModel.destroy({
      where: {
        bonusId: bonusId
      },
      transaction
    })
    await transaction.commit()
    return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
