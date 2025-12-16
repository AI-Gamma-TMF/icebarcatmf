import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    antiFraudRuleId: { type: 'number' },
    isActive: { type: 'boolean' },
    isDeleted: { type: 'boolean' }
  },
  required: ['antiFraudRuleId']
}
const constraints = ajv.compile(schema)

export class UpdateRule extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const {
        antiFraudRuleId,
        isActive,
        isDeleted
      } = this.args

      await db.antiFraudRules.update({ isActive, isDeleted }, { where: { antiFraudRuleId } })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
