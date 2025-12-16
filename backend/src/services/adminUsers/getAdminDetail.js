
import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TICKET_TYPE } from '../../utils/constants/constant'
// import { decodeCredential } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    adminUserId: { type: ['string'] }
  }
}

const constraints = ajv.compile(schema)

export class GetAdminDetail extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.context.req.body
    const { adminUserId } = this.args
    let query, ticketQuery

    try {
      if (adminUserId) {
        if (!(+adminUserId)) {
          return this.addError('InvalidIdErrorType')
        }
        query = { adminUserId: adminUserId }
      } else {
        query = { adminUserId: id }
      }

      const adminDetails = await getOne({
        model: db.AdminUser,
        include: [
          { model: db.AdminRole },
          { model: db.AdminUserPermission, as: 'userPermission' }
        ],
        data: query
      })

      if (!adminDetails) return this.addError('AdminNotFoundErrorType')

      delete adminDetails.dataValues.password
      return { adminDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
