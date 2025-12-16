import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import { removeData, updateRedeemJobTime } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    ruleId: { type: 'number' },
    playerIds: { type: ['array', 'null'], items: { type: 'number' } }
  },
  required: ['ruleId']
}

const constraints = ajv.compile(schema)
export class RemoveUsersFromRuleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        RedeemRule: RedeemRuleModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { ruleId, playerIds } = this.args

    try {
      const isRuleExist = await RedeemRuleModel.findOne({
        attributes: ['playerIds'],
        where: { ruleId },
        raw: true,
        transaction
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      if (playerIds && playerIds.length > 0) {
        const existingPlayerIds = isRuleExist?.playerIds || []
        const updatedUsers = existingPlayerIds.filter(id => !playerIds.includes(id))
        await RedeemRuleModel.update({
          playerIds: updatedUsers
        }, { where: { ruleId }, transaction })
      }

      await removeData('redeem-rule-data')

      updateRedeemJobTime(ruleId)

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
