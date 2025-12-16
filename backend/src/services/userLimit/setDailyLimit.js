import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LIMIT_TIME_PERIOD } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['userType', 'userId', 'dailyLimit', 'timePeriod']
}
const constraints = ajv.compile(schema)

export class SetDailyLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, dailyLimit, timePeriod, reset } = this.args
    let user

    try {
      user = await getOne({ model: db.User, data: { userId } })
      if (!user) return this.addError('UserNotExistsErrorType')
      const userLimits = await getOne({ model: db.Limit, data: { userId } })
      if (userLimits === null) {
        return this.addError('LimitErrorType')
      }
      let limit = userLimits.dataValues

      if (timePeriod === LIMIT_TIME_PERIOD.DAILY) {
        if (reset) {
          return { limit: await userLimits.set({ dailyBetLimit: null, dailyBetExpiry: null, dailyBetUpdatedAt: new Date() }).save() }
        }
        if (userLimits.weeklyBetLimit && dailyLimit > userLimits.weeklyBetLimit) {
          return this.addError('DailyLimitErrorType')
        }
        if (userLimits.monthlyBetLimit && dailyLimit > userLimits.monthlyBetLimit) {
          return this.addError('DailyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ dailyBetLimit: dailyLimit, dailyBetExpiry: now, dailyBetUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return { limit: await userLimits.set({ weeklyBetLimit: null, weeklyBetExpiry: null, weeklyBetUpdatedAt: new Date() }).save() }
        }
        if (userLimits.dailyBetLimit && dailyLimit < userLimits.dailyBetLimit) {
          return this.addError('WeeklyLimitErrorType')
        }
        if (userLimits.monthlyBetLimit && dailyLimit > userLimits.monthlyBetLimit) {
          return this.addError('WeeklyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ weeklyBetLimit: dailyLimit, weeklyBetExpiry: now, weeklyBetUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return { limit: await userLimits.set({ monthlyBetLimit: null, monthlyBetExpiry: null, monthlyBetUpdatedAt: new Date() }).save() }
        }
        if (userLimits.dailyBetLimit && dailyLimit < userLimits.dailyBetLimit) {
          return this.addError('MonthlyLimitErrorType')
        }
        if (userLimits.weeklyBetLimit && dailyLimit < userLimits.weeklyBetLimit) {
          return this.addError('MonthlyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ monthlyBetLimit: dailyLimit, monthlyBetExpiry: now, monthlyBetUpdatedAt: new Date() }).save()
      }

      return { limit, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
