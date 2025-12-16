import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { LIMIT_TIME_PERIOD } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['userType', 'userId', 'lossLimit', 'timePeriod']
}
const constraints = ajv.compile(schema)

export class SetLossLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, lossLimit, timePeriod, reset } = this.args
    let user

    try {
      user = await getOne({ model: db.User, data: { userId } })
      if (!user) return this.addError('UserNotExistsErrorType')

      const userLimits = await getOne({ model: db.Limit, data: { userId } })
      let limit = userLimits.dataValues

      if (timePeriod === LIMIT_TIME_PERIOD.DAILY) {
        if (reset) {
          return {
            limit: await userLimits.set({ dailyLossLimit: null, dailyLossExpiry: null, dailyLossUpdatedAt: new Date() }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.weeklyLossLimit && lossLimit > userLimits.weeklyLossLimit) {
          return this.addError('DailyLimitErrorType')
        }
        if (userLimits.monthlyLossLimit && lossLimit > userLimits.monthlyLossLimit) {
          return this.addError('DailyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ dailyLossLimit: lossLimit, dailyLossExpiry: now, dailyLossUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return {
            limit: await userLimits.set({ weeklyLossLimit: null, weeklyLossExpiry: null, weeklyLossUpdatedAt: new Date() }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.dailyLossLimit && lossLimit < userLimits.dailyLossLimit) {
          return this.addError('WeeklyLimitErrorType')
        }
        if (userLimits.monthlyLossLimit && lossLimit > userLimits.monthlyLossLimit) {
          return this.addError('WeeklyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ weeklyLossLimit: lossLimit, weeklyLossExpiry: now, weeklyLossUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return {
            limit: await userLimits.set({ monthlyLossLimit: null, monthlyLossExpiry: null, monthlyLossUpdatedAt: new Date() }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.dailyLossLimit && lossLimit < userLimits.dailyLossLimit) {
          return this.addError('MonthlyLimitErrorType')
        }
        if (userLimits.weeklyLossLimit && lossLimit < userLimits.weeklyLossLimit) {
          return this.addError('MonthlyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ monthlyLossLimit: lossLimit, monthlyLossExpiry: now, monthlyLossUpdatedAt: new Date() }).save()
      }

      return { limit, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
