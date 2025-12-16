import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { updateMaintenanceModeJobTime } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    startTime: { type: 'string' },
    endTime: { type: 'string' },
    message: { type: ['string', 'null'] }
  },
  required: ['startTime', 'endTime']
}

const constraints = ajv.compile(schema)

export class CreateMaintenanceModeService extends ServiceBase {
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

    const { startTime, endTime, message } = this.args

    const maintenanceModeStartTime = new Date(startTime)

    const maintenanceModeEndTime = new Date(endTime)

    if (maintenanceModeStartTime >= maintenanceModeEndTime) return this.addError('MaintenanceModeEndTimeErrorType')

    try {
      const isExist = await MaintenanceModeModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        raw: true,
        transaction
      })

      if (isExist) return this.addError('MaintenanceModeAlreadyExistErrorType')

      let scheduleDetail = {
        startTime,
        endTime,
        isActive: false
      }

      if (message) scheduleDetail = { ...scheduleDetail, message }

      const maintenanceModeData = await MaintenanceModeModel.create(scheduleDetail, { transaction })

      updateMaintenanceModeJobTime(maintenanceModeData.maintenanceModeId)

      return { maintenanceModeData, success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
