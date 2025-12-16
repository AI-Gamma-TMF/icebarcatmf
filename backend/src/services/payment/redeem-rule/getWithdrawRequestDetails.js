import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import sequelize, { Op } from 'sequelize'
import { pageValidation } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    ruleId: { type: 'number' },
    pageNo: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    email: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    status: { type: ['string', 'null'] }
  },
  required: ['ruleId']
}

const constraints = ajv.compile(schema)

export class GetWithdrawRequestDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        WithdrawRequest: WithdrawRequestModel,
        RedeemRule: RedeemRuleModel
      }
    } = this.context

    try {
      const { pageNo, limit, ruleId, status, orderBy, sortBy, email } = this.args

      const isRuleExist = await RedeemRuleModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { ruleId }
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      let query = { ruleId }

      if (status) query = { ...query, status: +status }

      if (email) query = { ...query, email: { [Op.iLike]: `%${email}%` } }

      const { page, size } = pageValidation(pageNo, limit)

      const withdrawUserDetails = await WithdrawRequestModel.findAndCountAll({
        where: query,
        attributes: ['userId', 'email', 'status', 'amount', 'paymentProvider', 'transactionId'],
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'createdAt', sortBy || 'DESC']],
        raw: true
      })

      return { withdrawUserDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
