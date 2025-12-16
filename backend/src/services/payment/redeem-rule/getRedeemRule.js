import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { pageValidation } from '../../../utils/common'

export class GetRedeemRuleService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        RedeemRule: RedeemRuleModel
      }
    } = this.context

    try {
      const { pageNo, limit, ruleId, orderBy, sort } = this.args

      let query, redeemRules

      if (ruleId) query = { ruleId }

      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)

        redeemRules = await RedeemRuleModel.findAndCountAll({
          where: query,
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'createdAt', sort || 'DESC']]
        })
      } else {
        redeemRules = await RedeemRuleModel.findAndCountAll({
          where: query,
          order: [['createdAt', 'DESC']]
        })
      }
      return { redeemRules, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
