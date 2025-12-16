import sequelize from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { removeData, updateRedeemJobTime } from '../../../utils/common'

export class DeleteRedeemRuleService extends ServiceBase {
  async run () {
    const {
      dbModels: { RedeemRule: RedeemRuleModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const { ruleId } = this.args

      const isRuleExist = await RedeemRuleModel.findOne({
        where: { ruleId },
        attributes: [[sequelize.literal('1'), 'exists']],
        transaction
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      updateRedeemJobTime(ruleId)

      await RedeemRuleModel.destroy({
        where: { ruleId },
        transaction
      })

      await removeData('redeem-rule-data')

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
