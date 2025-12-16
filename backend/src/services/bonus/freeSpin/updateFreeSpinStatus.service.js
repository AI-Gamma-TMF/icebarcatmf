import ServiceBase from '../../../libs/serviceBase'
import { statusUpdateJobScheduler } from '../../../utils/common'
import { BONUS_STATUS, FREE_SPINS_STATUS } from '../../../utils/constants/constant'

export class UpdateFreeSpinStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel,
        UserBonus: UserBonusModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { freeSpinId } = this.args

    try {
      const freeSpinExist = await FreeSpinBonusGrantModel.findOne({
        where: { freeSpinId },
        transaction,
        raw: true
      })

      if (!freeSpinExist) return this.addError('FreeSpinBonusNotExistErrorType')

      if (+freeSpinExist.status === FREE_SPINS_STATUS.CANCELLED) return this.addError('FreeSpinIsCancelledErrorType')
      if (+freeSpinExist.status === FREE_SPINS_STATUS.COMPLETED) return this.addError('CannotCancelFreeSpinErrorType')

      await Promise.all([
        FreeSpinBonusGrantModel.update(
          {
            status: FREE_SPINS_STATUS.CANCELLED
          },
          {
            where: { freeSpinId },
            transaction
          }
        ),
        UserBonusModel.update({ status: BONUS_STATUS.CANCELLED }, {
          where: {
            freeSpinId: +freeSpinId,
            status: BONUS_STATUS.PENDING
          }
        })
      ])

      statusUpdateJobScheduler('DELETE', 'freeSpin', +freeSpinExist?.freeSpinId)

      return { success: true, message: 'Freespin is cancelled successfully' }
    } catch (error) {
      console.log('Error Occur in UpdateFreeSpinStatusService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
