
import ServiceBase from '../../libs/serviceBase'
import { prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetSubscriptionPlanDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Subscription: SubscriptionModel,
        SubscriptionFeature: SubscriptionFeatureModel,
        SubscriptionFeatureMap: SubscriptionFeatureMapModel
      }
    } = this.context

    const { subscriptionId } = this.args

    try {
      const checkSubscriptionExist = await SubscriptionModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { subscriptionId: subscriptionId },
        include: [
          {
            attributes: [['value', 'featureValue']],
            model: SubscriptionFeatureMapModel,
            as: 'features',
            include: [
              {
                model: SubscriptionFeatureModel,
                as: 'featureDetail',
                attributes: ['name', 'description', 'isActive', 'subscriptionFeatureId', 'valueType', 'key']
              }
            ]
          }
        ]
      })

      if (!checkSubscriptionExist) return this.addError('SubscriptionPlanNotExistErrorType')

      checkSubscriptionExist.dataValues.thumbnail = checkSubscriptionExist?.thumbnail && prepareImageUrl(checkSubscriptionExist.thumbnail)

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
