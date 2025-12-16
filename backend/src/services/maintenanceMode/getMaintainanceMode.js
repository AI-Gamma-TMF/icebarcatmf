import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    maintenanceModeId: {
      type: ['string', 'null']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetMaintenanceModeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MaintenanceMode: MaintenanceModeModel
      }
    } = this.context

    const { pageNo, limit, maintenanceModeId } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let query = {}

      if (maintenanceModeId) query = { ...query, maintenanceModeId }

      const maintenanceModeDetails = await MaintenanceModeModel.findAndCountAll({
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [['createdAt', 'DESC']]
      })

      return { maintenanceModeDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
