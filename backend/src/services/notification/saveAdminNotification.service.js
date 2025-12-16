import ServiceBase from '../../libs/serviceBase'
import db, { sequelize } from '../../db/models'

export class SaveAdminNotificationService extends ServiceBase {
  async run () {
    const adminNotificationModel = db.AdminNotification
    const transaction = await sequelize.transaction()
    try {
      const data = this.args

      const { id } = await adminNotificationModel.create(data, { transaction })
      await transaction.commit()

      return id
    } catch (error) {
      await transaction.rollback()
      console.error('SaveAdminNotificationService', error)
      this.addError('InternalServerErrorType', error)
      return { status: 500, message: error }
    }
  }
}
