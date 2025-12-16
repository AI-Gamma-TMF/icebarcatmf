import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class AccountCaptureEmitter {
  static async emitAccountCaptureStatus (socketObj, playerId) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.USER_WALLET + ':' + +playerId
      socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.ACCOUNT_CAPTURE, { data: { ...socketObj } })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
