import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LIMIT_TIME_PERIOD } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['userId', 'depositLimit', 'timePeriod']
}
const constraints = ajv.compile(schema)

export class SetDepositLimitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, depositLimit, timePeriod, reset } = this.args
    let user

    try {
      user = await getOne({ model: db.User, data: { userId } })
      if (!user) return this.addError('UserNotExistsErrorType')

      const userLimits = await getOne({ model: db.Limit, data: { userId } })
      let limit = userLimits.dataValues

      if (timePeriod === LIMIT_TIME_PERIOD.DAILY) {
        if (reset) {
          return {
            limit: await userLimits.set({ dailyDepositLimit: null, dailyDepositExpiry: null, dailyDepositUpdatedAt: new Date() }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.weeklyDepositLimit && depositLimit > userLimits.weeklyDepositLimit) {
          return this.addError('DailyLimitErrorType')
        }
        if (userLimits.monthlyDepositLimit && depositLimit > userLimits.monthlyDepositLimit) {
          return this.addError('DailyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ dailyDepositLimit: depositLimit, dailyDepositExpiry: now, dailyDepositUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return {
            limit: await userLimits.set({ weeklyDepositLimit: null, weeklyDepositExpiry: null }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.dailyDepositLimit && depositLimit < userLimits.dailyDepositLimit) {
          return this.addError('WeeklyLimitErrorType')
        }
        if (userLimits.monthlyDepositLimit && depositLimit > userLimits.monthlyDepositLimit) {
          return this.addError('WeeklyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ weeklyDepositLimit: depositLimit, weeklyDepositExpiry: now, weeklyDepositUpdatedAt: new Date() }).save()
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return {
            limit: await userLimits.set({ monthlyDepositLimit: null, monthlyDepositExpiry: null, monthlyDepositUpdatedAt: new Date() }).save(),
            message: SUCCESS_MSG.GET_SUCCESS
          }
        }
        if (userLimits.dailyDepositLimit && depositLimit < userLimits.dailyDepositLimit) {
          return this.addError('MonthlyLimitErrorType')
        }
        if (userLimits.weeklyDepositLimit && depositLimit < userLimits.weeklyDepositLimit) {
          return this.addError('MonthlyLimitErrorType')
        }

        const now = new Date()
        now.setDate(now.getDate() + 1)

        limit = await userLimits.set({ monthlyDepositLimit: depositLimit, monthlyDepositExpiry: now, monthlyDepositUpdatedAt: new Date() }).save()
      }
      return { limit, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
