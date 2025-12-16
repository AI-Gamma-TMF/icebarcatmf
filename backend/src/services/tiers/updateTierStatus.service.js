import ServiceBase from '../../libs/serviceBase'
import { removeData, updateTierLevel, updateUsersTierJobScheduler } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateTierStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel, UserTier: UserTierModel },
      sequelizeTransaction: transaction
    } = this.context

    const { tierId, isActive } = this.args

    const findTier = await TierModel.findOne({
      where: {
        tierId
      }
    })

    if (!findTier) return this.addError('TierNotFoundErrorType')

    if (findTier.level === 1) return this.addError('BaseTierCannotBeDisabledErrorType')

    const userTier = await UserTierModel.findOne({
      where: {
        tierId: findTier.tierId
      }
    })

    if (userTier) return this.addError('CannotUpdateTierErrorType')

    await TierModel.update(
      {
        isActive,
        level: null
      },
      {
        where: {
          tierId: findTier.tierId
        },
        transaction
      }
    )

    await Promise.all([updateTierLevel(transaction), removeData('tier-data'), removeData('base-tier-data')])

    await updateUsersTierJobScheduler()
    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
