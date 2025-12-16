import ServiceBase from '../../libs/serviceBase'
import { updateTierLevel, updateUsersTierJobScheduler } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteTierService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel, UserTier: UserTierModel },
      sequelizeTransaction
    } = this.context

    const { tierId } = this.args

    const tier = await TierModel.findOne({
      where: {
        tierId
      }
    })

    if (!tier) return this.addError('TierNotFoundErrorType')

    const userTier = await UserTierModel.findOne({
      where: {
        tierId: tier.tierId
      }
    })

    if (userTier) return this.addError('CannotUpdateTierErrorType')

    await TierModel.destroy({
      where: { tierId },
      transaction: sequelizeTransaction
    })

    await updateTierLevel(sequelizeTransaction)

    await updateUsersTierJobScheduler()

    return {
      success: true,
      message: SUCCESS_MSG.DELETE_SUCCESS
    }
  }
}
