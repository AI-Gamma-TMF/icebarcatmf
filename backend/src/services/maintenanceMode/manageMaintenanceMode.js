import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import UserNotificationEmitter from '../../socket-resources/emmitter/userNotification.emmiter'
import { deleteAllTokens, removeData, setData, updateMaintenanceModeJobTime } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { round } from 'number-precision'

const schema = {
  type: 'object',
  properties: {
    maintenanceModeId: { type: 'number' },
    isActive: { type: 'boolean', enum: [true, false] }
  },
  required: ['maintenanceModeId', 'isActive']
}

const constraints = ajv.compile(schema)

export class ManageMaintenanceModeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MaintenanceMode: MaintenanceModeModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const { maintenanceModeId, isActive } = this.args

      const isExist = await MaintenanceModeModel.findOne({
        attributes: ['startTime', 'endTime'],
        where: { maintenanceModeId: +maintenanceModeId },
        raw: true,
        transaction
      })

      if (!isExist) return this.addError('MaintenanceModeDetailsNotFoundErrorType')

      let socketData = {}

      if (isActive) {
        // remove all the users and gamePlay Token
        await deleteAllTokens()

        await setData('is-maintenance-mode', true)

        const maintenanceModeEndTime = new Date(isExist.endTime)
        const maintenanceModeStartTime = new Date(isExist.startTime)

        // time duration of maintenance mode in minutes
        const remainingMinutes = +round((maintenanceModeEndTime - Date.now()) / 60000, 2)

        const maintenanceMinutes = +round((maintenanceModeEndTime - maintenanceModeStartTime) / 60000, 2)

        socketData = {
          isActive: true,
          isPopup: false,
          remainingMinutes: remainingMinutes,
          maintenanceTime: maintenanceMinutes
        }

        updateMaintenanceModeJobTime(maintenanceModeId)

        await MaintenanceModeModel.update({
          isActive: isActive
        }, { where: { maintenanceModeId }, transaction })
      } else {
        await removeData('is-maintenance-mode')

        socketData = {
          isActive: false,
          isPopup: false,
          remainingMinutes: 0,
          maintenanceTime: 0
        }

        await MaintenanceModeModel.destroy({
          where: { maintenanceModeId },
          transaction
        })
      }

      UserNotificationEmitter.emitMaintenanceModeNotification(socketData)

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
