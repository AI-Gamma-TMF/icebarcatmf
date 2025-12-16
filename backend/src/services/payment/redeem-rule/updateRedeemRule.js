import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import ajv from '../../../libs/ajv'
import { removeData, updateRedeemJobTime } from '../../../utils/common'

const schema = {
  type: 'object',
  properties: {
    ruleId: { type: 'number' },
    ruleName: { type: ['string', 'null'] },
    ruleCondition: { type: ['object', 'null'] },
    completionTime: { type: ['string', 'null'] },
    isActive: { type: 'boolean', enum: [true, false] },
    isSubscriberOnly: { type: 'boolean', enum: [true, false] },
    playerIds: { type: ['array', 'null'], items: { type: 'number' } }
  },
  required: ['ruleId']
}

const constraints = ajv.compile(schema)
export class UpdateRedeemRuleService extends ServiceBase {
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

    const { ruleId, ruleName, ruleCondition, completionTime, isActive, playerIds, isSubscriberOnly } = this.args

    try {
      const isRuleExist = await RedeemRuleModel.findOne({
        attributes: ['playerIds'],
        where: { ruleId },
        raw: true,
        transaction
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      const updateData = {}

      if (playerIds && playerIds.length > 0) {
        const existingPlayerIds = isRuleExist?.playerIds || []
        const updatedUsers = [...new Set([...existingPlayerIds, ...playerIds])]
        updateData.playerIds = updatedUsers
      } else {
        updateData.ruleName = ruleName
        updateData.ruleCondition = ruleCondition
        updateData.completionTime = completionTime
        updateData.isActive = isActive
        updateData.isSubscriberOnly = isSubscriberOnly
      }

      await RedeemRuleModel.update(updateData, { where: { ruleId }, transaction })

      await removeData('redeem-rule-data')

      updateRedeemJobTime(ruleId)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
