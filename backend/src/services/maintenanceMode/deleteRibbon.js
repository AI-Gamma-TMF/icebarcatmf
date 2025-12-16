import ServiceBase from '../../libs/serviceBase'
import UserNotificationEmitter from '../../socket-resources/emmitter/userNotification.emmiter'
import { removeData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteRibbonDataService extends ServiceBase {
  async run () {
    try {
      const { isRibbon } = this.args

      await removeData('ribbon-setting')

      const ribbonData = {
        startMessage: '',
        endMessage: '',
        isCancelActive: '',
        remainingTime: 0,
        isRibbon: isRibbon
      }

      UserNotificationEmitter.emitUserNotification(ribbonData)

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
