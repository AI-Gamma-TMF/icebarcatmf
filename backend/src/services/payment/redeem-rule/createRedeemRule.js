import sequelize from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import ajv from '../../../libs/ajv'
import { removeData, updateRedeemJobTime } from '../../../utils/common'

const schema = {
  type: 'object',
  properties: {
    ruleName: { type: 'string' },
    ruleCondition: { type: 'object' },
    completionTime: { type: 'string' },
    isActive: { type: 'boolean', enum: [true, false] },
    isSubscriberOnly: { type: 'boolean', enum: [true, false] }
  },
  required: ['ruleName', 'ruleCondition', 'completionTime']
}

const constraints = ajv.compile(schema)
export class CreateRedeemRuleService extends ServiceBase {
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

    const { ruleName, ruleCondition, completionTime, isActive, isSubscriberOnly } = this.args

    try {
      const isExist = await RedeemRuleModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { ruleName },
        transaction
      })

      if (isExist) return this.addError('RuleAlreadyExistErrorType')

      const ruleDetails = await RedeemRuleModel.create({
        ruleName,
        ruleCondition,
        completionTime,
        isActive,
        isSubscriberOnly
      }, { transaction })

      updateRedeemJobTime()

      await removeData('redeem-rule-data')

      return { ruleDetails, success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
