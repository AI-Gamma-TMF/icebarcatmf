import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import moment from 'moment'
import { removeData } from '../../../utils/common'

export class CreateScratchCardBudgetsService extends ServiceBase {
  async run () {
    const { dbModels: { ScratchCardBudgetUsage: ScratchCardBudgetUsageModel }, sequelizeTransaction: transaction } = this.context
    const { scratchCardId, budgetAmount, budgetType } = this.args
    let obj
    if (budgetAmount <= 0) return this.addError('ValueShouldGreaterThanZeroErrorType')
    try {
      const scratchCardbudgets = await ScratchCardBudgetUsageModel.findAll({
        attributes: ['id', 'budgetType', 'budgetAmount'],
        where: { scratchCardId, isActive: true },
        pranoid: true,
        transaction
      })
      const dailyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'daily')
      const weeklyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'weekly')
      const monthlyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'monthly')

      if (!dailyBudget && budgetType === 'daily') {
        if (weeklyBudget && budgetAmount > weeklyBudget.budgetAmount) return this.addError('DailyLimitExceedsWeeklyLimitType')
        if (monthlyBudget && budgetAmount > monthlyBudget.budgetAmount) return this.addError('DailyLimitExceedsMonthlyLimitType')

        obj = {
          scratchCardId,
          budgetType: 'daily',
          budgetAmount,
          periodStart: moment().utc().startOf('day').toDate(),
          periodEnd: moment().utc().endOf('day').toDate(),
          isActive: true
        }
      }

      if (!weeklyBudget && budgetType === 'weekly') {
        if (dailyBudget && budgetAmount < dailyBudget.budgetAmount) return this.addError('WeeklyLimitLessThanDailyLimitType')
        if (monthlyBudget && budgetAmount > monthlyBudget.budgetAmount) return this.addError('WeeklyLimitExceedsMonthlyLimitType')
        obj = {
          scratchCardId,
          budgetType: 'weekly',
          budgetAmount,
          periodStart: moment().utc().startOf('week').toDate(),
          periodEnd: moment().utc().endOf('week').toDate(),
          isActive: true
        }
      }

      if (!monthlyBudget && budgetType === 'monthly') {
        if (dailyBudget && budgetAmount < dailyBudget.budgetAmount) return this.addError('MonthlyLimitLessThanDailyLimitType')
        if (weeklyBudget && budgetAmount < weeklyBudget.budgetAmount) return this.addError('MonthlyLimitLessThanWeeklyLimitType')
        obj = {
          scratchCardId,
          budgetType: 'monthly',
          budgetAmount,
          periodStart: moment().utc().startOf('month').toDate(),
          periodEnd: moment().utc().endOf('month').toDate(),
          isActive: true
        }
      }
      await ScratchCardBudgetUsageModel.create({ ...obj, transaction })
      await removeData(`scratchCardBudgetsList:${scratchCardId}`)
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
