import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { ROLE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limit: { type: 'string', pattern: '^[0-9]+$' },
    pageNo: { type: 'string', pattern: '^[0-9]+$' },
    actioneeType: { type: 'string', enum: ['all', 'admin', 'user'] }
  },
  required: ['userId', 'actioneeType']
}
const constraints = ajv.compile(schema)

export class GetActivityLogsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, actioneeType, pageNo, limit } = this.args
    let query = { userId }
    let order = [['createdAt', 'DESC']]

    try {
      const userDetails = await getOne({ model: db.User, data: query, attributes: ['userId'] })
      if (!userDetails) return this.addError('UserNotExistsErrorType')

      const { page, size } = pageValidation(pageNo, limit)

      if (actioneeType !== 'all') query = { ...query, actioneeType: ROLE[actioneeType.toUpperCase()] }
      if (actioneeType === ROLE.ADMIN) {
        order = [['moreDetails.favorite', 'DESC'], ['createdAt', 'DESC']]
        query = { ...query, remark: { [Op.ne]: '' } }
      }

      const activityLogs = await db.ActivityLog.findAndCountAll({
        where: {
          ...query
        },
        order,
        include: [{ model: db.AdminUser, attributes: ['adminUsername'], as: 'admin', required: false }, { model: db.User, attributes: ['username'], as: 'user', required: false }],
        limit: size,
        offset: ((page - 1) * size)
      })

      return { success: true, activityLogs, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
