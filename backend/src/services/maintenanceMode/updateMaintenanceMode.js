import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateMaintenanceModeJobTime } from '../../utils/common'
import sequelize from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    startTime: { type: 'string' },
    endTime: { type: 'string' },
    maintenanceModeId: { type: 'number' },
    message: { type: ['string', 'null'] }
  },
  required: ['maintenanceModeId']
}

const constraints = ajv.compile(schema)

export class UpdateMaintenanceModeService extends ServiceBase {
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

    const { startTime, endTime, maintenanceModeId, message } = this.args

    try {
      const isExist = await MaintenanceModeModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { maintenanceModeId },
        transaction
      })

      if (!isExist) return this.addError('MaintenanceModeDetailsNotFoundErrorType')

      const updatedData = {
        startTime,
        endTime,
        message
      }

      await MaintenanceModeModel.update(updatedData, { where: { maintenanceModeId }, transaction })

      updateMaintenanceModeJobTime(maintenanceModeId)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
