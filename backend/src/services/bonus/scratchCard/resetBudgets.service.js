import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import { removeData } from '../../../utils/common'

export class ResetScratchCardBudgetsService extends ServiceBase {
  async run () {
    const { dbModels: { ScratchCardBudgetUsage: ScratchCardBudgetUsageModel } } = this.context
    const { scratchCardId, budgetId, actionType, budgetAmount } = this.args
    let message
    try {
      if (actionType === 'reset') {
        await ScratchCardBudgetUsageModel.update({ isActive: false, deletedAt: new Date() }, { where: { scratchCardId, id: budgetId } })
        message = SUCCESS_MSG.DELETE_SUCCESS
      }
      if (actionType === 'update') {
        const scratchCardbudgets = await ScratchCardBudgetUsageModel.findAll({
          attributes: ['id', 'budgetType', 'budgetAmount'],
          where: { scratchCardId, isActive: true },
          pranoid: true
        })
        const dailyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'daily')
        const weeklyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'weekly')
        const monthlyBudget = scratchCardbudgets.find(budget => budget.budgetType === 'monthly')

        if (dailyBudget && dailyBudget.id === budgetId) {
          if (weeklyBudget && budgetAmount > weeklyBudget.budgetAmount) return this.addError('DailyLimitExceedsWeeklyLimitType')
          if (monthlyBudget && budgetAmount > monthlyBudget.budgetAmount) return this.addError('DailyLimitExceedsMonthlyLimitType')
        }

        if (weeklyBudget && weeklyBudget.id === budgetId) {
          if (dailyBudget && budgetAmount < dailyBudget.budgetAmount) return this.addError('WeeklyLimitLessThanDailyLimitType')
          if (monthlyBudget && budgetAmount > monthlyBudget.budgetAmount) return this.addError('WeeklyLimitExceedsMonthlyLimitType')
        }

        if (monthlyBudget && monthlyBudget.id === budgetId) {
          if (dailyBudget && budgetAmount < dailyBudget.budgetAmount) return this.addError('MonthlyLimitLessThanDailyLimitType')
          if (weeklyBudget && budgetAmount < weeklyBudget.budgetAmount) return this.addError('MonthlyLimitLessThanWeeklyLimitType')
        }

        await ScratchCardBudgetUsageModel.update({ budgetAmount }, { where: { scratchCardId, id: budgetId } })
        message = SUCCESS_MSG.UPDATE_SUCCESS
      }
      await removeData(`scratchCardBudgetsList:${scratchCardId}`)
      return { success: true, message }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
