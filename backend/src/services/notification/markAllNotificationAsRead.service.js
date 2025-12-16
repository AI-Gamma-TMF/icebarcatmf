import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { sequelize } from '../../db/models'
import { QueryTypes } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    markRead: { type: 'string' },
    type: { type: 'string' }
  }
}
const constraints = ajv.compile(schema)

export class MarkAllNotificationAsRead extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { markRead, type } = this.args
    const { id } = this.context.req.body

    let whereClause = "WHERE type != 'CRITICAL_ALERT'"
    if (type === 'CRITICAL_ALERT') whereClause = "WHERE type = 'CRITICAL_ALERT'"

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
           ) ${whereClause}
          `,
          {
            replacements: {
              id: [+id]
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
           ), '[]'::jsonb) ${whereClause}
          `,
          {
            replacements: {
              id: +id
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
        message: `All notifications marked as ${
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
