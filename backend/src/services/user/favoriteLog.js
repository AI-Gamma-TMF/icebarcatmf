import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    logId: { type: 'number' },
    userId: { type: 'number' },
    favorite: { type: 'boolean' }
  },
  required: ['favorite', 'logId', 'userId']
}
const constraints = ajv.compile(schema)

export class FavoriteLogService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { favorite, logId, userId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const activityLog = await getOne({
        model: db.ActivityLog,
        data: { activityLogId: logId, userId },
        attributes: ['activityLogId', 'moreDetails'],
        transaction
      })

      if (!activityLog) return this.addError('ActivityLogErrorType')

      await activityLog.set({ moreDetails: { ...activityLog?.moreDetails, favorite } }).save({ transaction })

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
