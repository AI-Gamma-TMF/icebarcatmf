import ServiceBase from '../../libs/serviceBase'
import { removeAllSubKeysData, removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateSubscriptionFeatureService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        SubscriptionFeature: SubscriptionFeatureModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { subscriptionFeatureId, name, description, isActive } = this.args

    try {
      const checkSubscriptionFeatureExist = await SubscriptionFeatureModel.findOne({
        attributes: ['subscriptionFeatureId'],
        where: { subscriptionFeatureId },
        raw: true,
        transaction
      })

      if (!checkSubscriptionFeatureExist) return this.addError('SubscriptionFeatureNotExistErrorType')

      await Promise.all([SubscriptionFeatureModel.update({ name, description, isActive }, { where: { subscriptionFeatureId }, transaction }), removeAllSubKeysData('subscription'), removeAllSubKeysData('subscriptionFeature'), removeData('active-subscription-feature')])

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
