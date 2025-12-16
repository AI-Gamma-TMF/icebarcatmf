import { Op, Sequelize } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterByNameEmailGroup, pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'string' },
    user: { type: 'object' },
    sort: {
      enum: ['asc', 'desc']
    },
    orderBy: {
      type: 'string',
      enum: ['roleId', 'parentId', 'adminUserId', 'email', 'firstName', 'lastName']
    },
    limit: { type: 'string' },
    group: { type: 'string' },
    pageNo: { type: 'string' },
    search: { type: 'string' },
    roleId: { type: 'string' },
    status: { type: 'string' }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetVipManagers extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, adminId, orderBy, pageNo, limit, sort, search, roleId, status } = this.args
    let query, adminDetails

    try {
      if (search) {
        query = {
          ...query,
          [Op.and]: [
            {
              [Op.or]: [
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name'), ' ', Sequelize.col('email'), ' ', Sequelize.col('group')), {
                  [Op.iLike]: `%${search}%`
                }),
                { email: { [Op.iLike]: `%${search}%` } }]
            }
          ]
        }
      }
      if (search) query = filterByNameEmailGroup(query, search)
      if (roleId && roleId !== 'all') query = { ...query, roleId: roleId }
      if (+(adminId)) query = { ...query, adminUserId: adminId }
      if (status && status !== 'all') query = { ...query, isActive: status }
      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)

        adminDetails = await db.AdminUser.findAndCountAll({
          where: { ...query, adminUserId: { [Op.ne]: user.adminUserId } },
          limit: size,
          offset: ((page - 1) * size),
          order: [[orderBy || 'createdAt', sort || 'ASC']],
          attributes: {
            exclude: ['password', 'resetPasswordToken', 'resetPasswordSentAt']
          },
          include: [
            {
              model: db.AdminUserPermission,
              as: 'userPermission',
              required: true,
              where: Sequelize.where(
                Sequelize.literal('"userPermission"."permission" ? \'VipManagedBy\''),
                true
              ),
              attributes: []
            }
          ]
        })
      } else {
        adminDetails = await db.AdminUser.findAndCountAll({
          where: query,
          order: [[orderBy || 'createdAt', sort || 'ASC']],
          attributes: ['adminUserId', 'firstName', 'lastName'],
          include: [
            {
              model: db.AdminUserPermission,
              as: 'userPermission',
              required: true,
              where: Sequelize.where(
                Sequelize.literal('"userPermission"."permission" ? \'VipManagedBy\''),
                true
              ),
              attributes: []
            }
          ]
        })
      }
      return (adminDetails ? { adminDetails, message: SUCCESS_MSG.GET_SUCCESS } : this.addError('AdminNotFoundErrorType'))
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
