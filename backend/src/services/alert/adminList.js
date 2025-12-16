import db from '../../db/models'
import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class AdminListService extends ServiceBase {
  async run () {
    try {
      const admins = await db.AdminUserPermission.findAll({
        attributes: ['adminUserId'],
        where: {
          permission: { [Op.contains]: Sequelize.literal('\'{ "Alert" : ["U"] }\'::jsonb') }
        },
        include: [
          { model: db.AdminUser, attributes: ['adminUserId', 'firstName', 'lastName', 'adminUsername'] }
        ]
      })

      return { message: SUCCESS_MSG.USER_TICKETS, admins }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
