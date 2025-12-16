import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    roleId: { type: 'string' },
    adminId: { type: ['string'] }
  },
  required: ['adminId']
}

const constraints = ajv.compile(schema)

export class GetAdminChildren extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { adminId, roleId } = this.args
    let query

    try {
      if (!(+adminId >= 0) || (!(+roleId >= 0) && roleId)) {
        return this.addError('InvalidIdErrorType')
      }
      query = { parentId: adminId }

      if (roleId) {
        query = { ...query, roleId }
      }

      const adminDetails = await db.AdminUser.findAndCountAll({
        where: query,
        order: [['adminUserId', 'ASC']],
        attributes: ['adminUserId', 'firstName', 'lastName', 'email', 'roleId', 'parentId']
      })

      const details = []
      if (!adminDetails) return this.addError('AdminNotFoundErrorType')
      if (adminDetails.count) {
        await Promise.all(adminDetails.rows.map(async (admin) => {
          const childCount = await db.AdminUser.count({ where: { parentId: admin.adminUserId } })
          details.push({ ...admin.dataValues, childCount })
        }))
      }

      return { adminDetails: details, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
