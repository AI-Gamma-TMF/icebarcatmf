import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import UserNotificationEmitter from '../../socket-resources/emmitter/userNotification.emmiter'
import { setData, updateRibbonData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    startMessage: { type: ['string', 'null'] },
    endMessage: { type: ['string', 'null'] },
    time: { type: ['number', 'null'] },
    isCancelActive: { type: 'boolean', enum: [true, false] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class CreateRibbonService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { startMessage, endMessage, time, isCancelActive } = this.args

    try {
      const ribbonSetting = {
        startMessage: startMessage,
        endMessage: endMessage,
        isCancelActive: isCancelActive,
        remainingTime: time || 0,
        isRibbon: true
      }

      await setData('ribbon-setting', JSON.stringify(ribbonSetting))

      UserNotificationEmitter.emitUserNotification(ribbonSetting)

      updateRibbonData()

      return { ribbonSetting, success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
