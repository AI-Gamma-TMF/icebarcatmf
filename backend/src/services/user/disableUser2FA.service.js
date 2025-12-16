import ServiceBase from '../../libs/serviceBase'
import { activityLog } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DisableUser2FAService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { userId, reason, favorite, user } = this.args
    try {
      const userExist = await UserModel.findOne({
        where: { userId: userId }
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')
      await UserModel.update(
        {
          authEnable: false,
          authSecret: null,
          authUrl: null,
          mfaType: null
        },
        {
          where: { userId: userId },
          transaction
        })
      await activityLog({ user, userId, fieldChanged: 'Disable 2FA', originalValue: userExist.authEnable, changedValue: false, remark: reason, favorite, transaction })
      return { result: { authEnable: false }, success: true, message: SUCCESS_MSG.AUTH_DISABLE }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
