import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { Op, Sequelize } from 'sequelize'
import { sequelize } from '../../db/models'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    username: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'null', 'false'] }
  }
}
const constraints = ajv.compile(schema)

export class AuditSessionLogsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { UserActivities: ActivityModel } } = this.context
    const { limit, pageNo, startDate, endDate, username, userId } = this.args
    let sessionLogs

    try {
      let query = ''
      const { page, size } = pageValidation(pageNo, limit)

      if (userId) {
        sessionLogs = await ActivityModel.findAndCountAll({
          where: {
            userId,
            activityType: { [Op.in]: [USER_ACTIVITIES_TYPE.LOGIN, USER_ACTIVITIES_TYPE.LOGOUT] }
          },
          order: [['createdAt', 'DESC']],
          attributes: { exclude: ['userActivityId', 'uniqueId', 'updatedAt'] },
          limit: size,
          offset: ((page - 1) * size)
        })
      } else {
        if (username) query = `AND username ILIKE '%${username}%'`

        sessionLogs = await sequelize.query(`
          SELECT user_activities.unique_id AS uniqueId, user_activities.user_id AS userId,
            MAX(CASE WHEN activity_type = 'login' THEN user_activities.created_at END) AS login_a,
            MAX(CASE WHEN activity_type = 'logout' THEN user_activities.created_at END) AS logoutCreatedAt,
            MAX(CASE WHEN activity_type = 'login' THEN ip_address END) AS ipAddress,
            username
          FROM user_activities
          INNER JOIN users ON users.user_id = user_activities.user_id ${query} 
          WHERE activity_type IN ('login', 'logout') AND date(user_activities.created_at) >= :startDate AND date(user_activities.created_at) <= :endDate
          GROUP BY user_activities.unique_id, user_activities.user_id, username
          ORDER BY MAX(CASE WHEN activity_type = 'login' THEN user_activities.created_at END) DESC
          LIMIT :size
          OFFSET :offset
        `,
        {
          replacements: { startDate, endDate, size, offset: size * (page - 1), username },
          type: Sequelize.QueryTypes.SELECT
        })
      }

      return { sessionLogs, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
