import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { pageValidation } from '../../../utils/common'
import { Op } from 'sequelize'

export class GetRuleUserDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        RedeemRule: RedeemRuleModel,
        User: UserModel
      }
    } = this.context

    try {
      const { pageNo, limit, ruleId, email } = this.args

      const isRuleExist = await RedeemRuleModel.findOne({
        where: { ruleId },
        raw: true
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      const query = {}

      if (isRuleExist.playerIds.length > 0 && email) {
        query.email = { [Op.iLike]: `%${email}%` }
      }

      const { page, size } = pageValidation(pageNo, limit)

      const userDetails = await UserModel.findAndCountAll({
        where: {
          userId: { [Op.in]: isRuleExist.playerIds },
          ...query
        },
        attributes: ['userId', 'email', 'username', 'isActive'],
        limit: size,
        offset: (page - 1) * size,
        raw: true
      })

      return { userDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
