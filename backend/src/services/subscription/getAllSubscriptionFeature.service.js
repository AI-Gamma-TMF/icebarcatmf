import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllSubscriptionFeatureService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        SubscriptionFeature: SubscriptionFeatureModel
      }
    } = this.context

    const { subscriptionFeatureId, isActive, sort = 'DESC', orderBy, limit, pageNo } = this.args

    const whereQuery = {}
    if (subscriptionFeatureId) whereQuery.subscriptionFeatureId = subscriptionFeatureId
    if (isActive) whereQuery.isActive = isActive

    try {
      const { page, size } = pageValidation(pageNo, limit)
      const checkSubscriptionFeatureExist = await SubscriptionFeatureModel.findAll({
        attributes: ['name', 'description', 'isActive', 'subscriptionFeatureId', 'key', 'valueType'],
        where: whereQuery,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'subscriptionFeatureId', sort]],
        raw: true
      })

      if (!checkSubscriptionFeatureExist) return this.addError('SubscriptionFeatureNotExistErrorType')

      return {
        success: true,
        data: checkSubscriptionFeatureExist,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
