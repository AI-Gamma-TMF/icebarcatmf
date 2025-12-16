import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

export default class AdminNotificationsEmitter {
  static async emitNotificationToAllAdmins (socketObj) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.ADMIN_NOTIFICATIONS
      socketEmitter.of(SOCKET_NAMESPACES.ADMIN_NOTIFICATIONS).to(room).emit(SOCKET_EMITTERS.ADMIN_NOTIFICATIONS, { data: socketObj })
    } catch (error) {
      console.log(error)
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
