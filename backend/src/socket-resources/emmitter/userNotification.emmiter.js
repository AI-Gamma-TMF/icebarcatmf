import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

export default class UserNotificationEmitter {
  static async emitUserNotification (socketObj) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.USER_NOTIFICATION
      socketEmitter.of(SOCKET_NAMESPACES.USER_NOTIFICATION).to(room).emit(SOCKET_EMITTERS.USER_NOTIFICATION_UPDATE, { data: socketObj })
    } catch (error) {
      console.log(error)
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting downtime notification to user' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitMaintenanceModeNotification (socketObj) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.USER_NOTIFICATION
      socketEmitter.of(SOCKET_NAMESPACES.USER_NOTIFICATION).to(room).emit(SOCKET_EMITTERS.MAINTENANCE_MODE_UPDATE, { data: socketObj })
    } catch (error) {
      console.log(error)
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting downtime notification to user' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
