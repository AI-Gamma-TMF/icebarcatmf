
import { Op, col } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllUserSubscriptionService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Subscription: SubscriptionModel,
        UserSubscription: UserSubscriptionModel
      }
    } = this.context

    const { limit, pageNo, sort = 'DESC', orderBy, userId, subscriptionId, startDate, endDate, status, autoRenew, search, transactionId, subscriptionType } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    try {
      const query = {}
      let userQuery = {}

      // User Model Query

      if (search) {
        userQuery = {
          ...userQuery,
          [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }

      if (userId) query.userId = +userId
      if (subscriptionId) query.subscriptionId = +subscriptionId
      if (autoRenew) query.autoRenew = autoRenew
      if (transactionId) query.transactionId = transactionId

      if (status && status !== 'all') { query.status = status }

      if (subscriptionType && subscriptionType !== 'all') { query.planType = subscriptionType }

      if (startDate && endDate) {
        query[Op.and] = [...(query[Op.and] || []),
          { startDate: { [Op.gte]: startDate } },
          { endDate: { [Op.lte]: endDate } }
        ]
      } else if (startDate && !endDate) {
        query.startDate = { [Op.gte]: startDate }
      } else if (!startDate && endDate) {
        query.endDate = { [Op.lte]: endDate }
      }

      const userSubscription = await UserSubscriptionModel.findAndCountAll({
        attributes: ['userSubscriptionId', 'subscriptionId', 'userId', 'startDate', 'endDate', 'status', 'autoRenew', 'transactionId', 'planType',
          [col('User.username'), 'username'], [col('User.email'), 'email'], [col('Subscription.name'), 'subscriptionName']],
        where: query,
        include: [
          {
            model: UserModel,
            attributes: [],
            where: userQuery
          },
          {
            model: SubscriptionModel,
            attributes: []
          }
        ],
        raw: true,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'subscriptionId', sort]]
      })

      return {
        success: true,
        data: userSubscription,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
