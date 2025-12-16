import ServiceBase from '../../../libs/serviceBase'
import { activityLog } from '../../../utils/common'
import {
  BONUS_STATUS,
  BONUS_TYPE,
  FREE_SPINS_STATUS
} from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class RemovePlayerFromFreeSpinService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel,
        UserBonus: UserBonusModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { user, freeSpinId, userId, reason, favorite, isAddUser = false } = this.args
    try {
      const freeSpinExist = await FreeSpinBonusGrantModel.findOne({
        where: { freeSpinId },
        transaction,
        raw: true
      })

      if (!freeSpinExist) return this.addError('FreeSpinBonusNotExistErrorType')

      if ((freeSpinExist.endDate && freeSpinExist.endDate < new Date()) || [FREE_SPINS_STATUS.COMPLETED, FREE_SPINS_STATUS.CANCELLED, FREE_SPINS_STATUS.EXPIRED].includes(+freeSpinExist?.status)) {
        return this.addError('FreeSpinAlreadyFinishedErrorType')
      }

      const isUserBonusExist = await UserBonusModel.findOne({
        attributes: ['userId', 'status'],
        where: {
          freeSpinId,
          bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
          userId: userId
        },
        transaction,
        raw: true
      })

      if (!isUserBonusExist) {
        return this.addError('UserNotExistForRemovalErrorType')
      }

      const newStatus = isAddUser ? BONUS_STATUS.PENDING : BONUS_STATUS.CANCELLED
      const allowedStatus = isAddUser ? BONUS_STATUS.CANCELLED : BONUS_STATUS.PENDING
      const remarkMessage = isAddUser ? 'Add User' : 'Remove User'
      const message = isAddUser ? 'User Add Successfully' : SUCCESS_MSG.DELETE_SUCCESS

      await Promise.all([
        UserBonusModel.update(
          { status: newStatus },
          {
            where: {
              freeSpinId,
              userId: +isUserBonusExist?.userId,
              bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
              status: allowedStatus
            },
            transaction
          }
        ),
        activityLog({
          user,
          userId,
          fieldChanged: newStatus,
          originalValue: isUserBonusExist.status,
          changedValue: 0,
          remark: reason || remarkMessage,
          favorite: favorite || false,
          transaction
        })
      ])

      return { status: true, message }
    } catch (error) {
      console.log('Error Occur in RemovePlayerFromFreeSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
