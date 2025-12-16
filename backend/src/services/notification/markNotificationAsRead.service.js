import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { sequelize } from '../../db/models'
import { QueryTypes } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    markRead: { type: 'string' }
  }
}
const constraints = ajv.compile(schema)

export class MarkNotificationAsRead extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { markRead } = this.args
    const { id } = this.context.req.body
    const { notificationId } = this.context.req.params

    const {
      sequelizeTransaction: transaction,
      dbModels: { AdminNotification: AdminNotificationModel }
    } = this.context

    try {
      if (markRead === 'true') {
        // Push to JSONB Array
        await sequelize.query(
          `UPDATE "admin_notifications" 
           SET "status" = (
             SELECT jsonb_agg(DISTINCT elem) 
             FROM jsonb_array_elements("status" || to_jsonb(:id)) AS elem
           )
           WHERE "id" = :notificationId`,
          {
            replacements: {
              id: [+id],
              notificationId: notificationId
            },
            type: QueryTypes.UPDATE,
            lock: {
              level: transaction.LOCK.UPDATE,
              of: AdminNotificationModel
            }
          }
        )
      } else {
        // Remove from JSONB Array
        await sequelize.query(
          `UPDATE "admin_notifications" 
           SET "status" = COALESCE((
             SELECT jsonb_agg(elem) 
             FROM jsonb_array_elements(status) AS elem
             WHERE elem <> to_jsonb(:id)
           ), '[]'::jsonb) -- Ensure status is never NULL
           WHERE "id" = :notificationId`,
          {
            replacements: {
              id: +id,
              notificationId: notificationId
            },
            type: QueryTypes.UPDATE,
            lock: {
              level: transaction.LOCK.UPDATE,
              of: AdminNotificationModel
            }
          }
        )
      }
      return {
        message: `Notification marked as ${
          markRead === 'true' ? 'read' : 'unread'
        }`
      }
    } catch (error) {
      console.error(
        'Error updating admin notification:',
        error.message,
        error.stack
      )

      return this.addError('InternalServerErrorType', error)
    }
  }
}
