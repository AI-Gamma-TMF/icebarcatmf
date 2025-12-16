import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation, prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllSubscriptionPlanService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Subscription: SubscriptionModel
      }
    } = this.context

    const { limit, pageNo, sort = 'DESC', orderBy, unifiedSearch } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    let query = {}

    if (unifiedSearch) {
      if (/^\d+$/.test(unifiedSearch)) {
        query = { ...query, subscriptionId: +unifiedSearch }
      } else {
        query = { ...query, name: { [Op.iLike]: `%${unifiedSearch}%` } }
      }
    }

    try {
      const checkSubscriptionExist = await SubscriptionModel.findAndCountAll({
        attributes: ['subscriptionId', 'name', 'description', 'monthlyAmount', 'yearlyAmount', 'weeklyPurchaseCount', 'scCoin', 'gcCoin', 'platform', 'isActive', 'specialPlan', 'thumbnail'],
        raw: true,
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'subscriptionId', sort]]
      })

      if (checkSubscriptionExist.rows.length) {
        checkSubscriptionExist.rows.map((subscription, index) => {
          checkSubscriptionExist.rows[index].thumbnail = subscription.thumbnail ? prepareImageUrl(subscription.thumbnail) : subscription.thumbnail
          return subscription
        })
      }

      return {
        success: true,
        data: checkSubscriptionExist,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
