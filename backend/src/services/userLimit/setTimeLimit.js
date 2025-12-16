import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  required: ['userType', 'userId', 'timeLimit']
}
const constraints = ajv.compile(schema)

export class SetTimeLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, timeLimit, reset } = this.args
    let user

    try {
      user = await getOne({ model: db.User, data: { userId } })
      if (!user) return this.addError('UserNotExistsErrorType')
      if (reset) {
        await db.Limit.update({ timeLimit: null, timeLimitExpiry: null, timeLimitUpdatedAt: new Date() }, { where: { userId } })
        return { reset: true, message: SUCCESS_MSG.GET_SUCCESS }
      }

      if (timeLimit > 24 || timeLimit < 1) return this.addError('SessionTimeLimitErrorType')

      const now = new Date()
      now.setDate(now.getDate() + 1)

      await db.Limit.update({ timeLimit, timeLimitExpiry: now, timeLimitUpdatedAt: new Date() }, { where: { userId } })

      const newLimits = await getOne({ model: db.Limit, data: { userId } })

      return { limit: newLimits, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
