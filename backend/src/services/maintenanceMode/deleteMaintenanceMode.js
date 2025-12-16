import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'
import UserNotificationEmitter from '../../socket-resources/emmitter/userNotification.emmiter'

const schema = {
  type: 'object',
  properties: {
    maintenanceModeId: { type: 'number' }
  },
  required: ['maintenanceModeId']
}

const constraints = ajv.compile(schema)

export class DeleteMaintenanceModeService extends ServiceBase {
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

    const { maintenanceModeId } = this.args

    try {
      const isExist = await MaintenanceModeModel.findOne({
        attributes: ['isActive'],
        where: { maintenanceModeId },
        raw: true,
        transaction
      })

      if (!isExist) return this.addError('MaintenanceModeDetailsNotFoundErrorType')
      if (isExist.isActive) this.addError('MaintenanceModeDeletionErrorType')

      const socketData = {
        isActive: false,
        isPopup: false,
        remainingMinutes: 0,
        maintenanceTime: 0
      }

      UserNotificationEmitter.emitMaintenanceModeNotification(socketData)

      await MaintenanceModeModel.destroy({
        where: { maintenanceModeId },
        transaction
      })

      await removeData('is-maintenance-mode')

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
