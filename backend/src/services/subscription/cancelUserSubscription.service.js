import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { PAYMENT_METHOD, SUBSCRIPTION_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class CancelUserSubscriptionService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        PreferredPayment: PreferredPaymentModel,
        UserSubscription: UserSubscriptionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { userSubscriptionId } = this.args

    try {
      const userSubscription = await UserSubscriptionModel.findOne({
        attributes: ['userSubscriptionId', 'userId', 'subscriptionId', 'status', 'endDate'],
        where: {
          userSubscriptionId: +userSubscriptionId
        },
        transaction,
        raw: true
      })

      if (!userSubscription) return this.addError('UserSubscriptionNotExistErrorType')

      await UserSubscriptionModel.update(
        { status: SUBSCRIPTION_STATUS.REJECTED },
        {
          where: {
            userSubscriptionId: userSubscription.userSubscriptionId
          },
          transaction
        }
      )

      // Now check if the above users has renew their subscription

      const activeSubscriptionUser = await UserSubscriptionModel.findOne({
        attributes: ['userId'],
        where: {
          status: SUBSCRIPTION_STATUS.ACTIVE,
          userId: userSubscription.userId,
          endDate: { [Op.gte]: new Date() }
        },
        transaction,
        raw: true
      })

      // update user subscription status to cancelled because these users don't have any subscription active
      if (!activeSubscriptionUser) {
        await UserModel.update({ subscriptionStatus: 0 }, {
          where: { userId: userSubscription.userId },
          transaction
        })
      }

      // check if their PreferredPayments are still locked with this user subscription Id

      await PreferredPaymentModel.update({
        recurringUserSubscriptionId: 0
      }, {
        where: {
          paymentMethodType: PAYMENT_METHOD.CARD,
          recurringUserSubscriptionId: userSubscription.userSubscriptionId,
          userId: userSubscription.userId
        },
        transaction
      })

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
