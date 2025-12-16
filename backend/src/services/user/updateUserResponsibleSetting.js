import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE } from '../../utils/constants/constant'
import db from '../../db/models'
import { activityLog, getCachedData, removeData } from '../../utils/common'
import { forceLogoutService } from './forceLogout'
import MultiLoginEmitter from '../../socket-resources/emmitter/multiLogin.emmiter'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    responsibleGamblingType: { type: 'string' },
    limitType: { type: 'string' },
    timeBreakDuration: { type: 'string' },
    selfExclusion: { type: 'boolean' },
    amount: { type: 'number' },
    userId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['responsibleGamblingType', 'userId', 'user']
}
const constraints = ajv.compile(schema)

export class UpdateUserResponsibleSetting extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      timeBreakDuration: time, selfExclusion, amount, responsibleGamblingType, userId, limitType, reason, favorite, user
    } = this.args
    const currentDate = new Date()
    const timeBreakDuration = new Date(time).setHours(
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    ) // Set the time of timeBreakDate to match the current time

    const { ResponsibleGambling: ResponsibleGamblingModel, User: userModel } = db
    const userDetails = await userModel.findOne({ where: { userId } })
    let field, changedValue, limitTypeTime
    let originalValue = ''

    try {
      if (amount < 0) return this.addError('AmountShouldNotNegativeErrorType')
      if (amount === 0) return this.addError('ValueShouldGreaterThanZeroErrorType')
      // Find existing active settings for the same responsibleGamblingType
      const existingSettings = await ResponsibleGamblingModel.findAll({
        where: { responsibleGamblingType, userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE }
      })
      if (limitType === '1') { // Daily Limit
        const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
        const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')

        if (weeklyLimit && amount > weeklyLimit.amount) return this.addError('DailyLimitExceedsWeeklyLimitType')
        if (monthlyLimit && amount > monthlyLimit.amount) return this.addError('DailyLimitExceedsMonthlyLimitType')
      }
      if (limitType === '2') { // Weekly Limit
        const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

        if (dailyLimit && amount < dailyLimit.amount) return this.addError('WeeklyLimitLessThanDailyLimitType')
        const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')
        if (monthlyLimit && amount > monthlyLimit.amount) return this.addError('WeeklyLimitExceedsMonthlyLimitType')
      }
      if (limitType === '3') { // Monthly Limit
        const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

        if (dailyLimit && amount < dailyLimit.amount) return this.addError('MonthlyLimitLessThanDailyLimitType')
        const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
        if (weeklyLimit && amount < weeklyLimit.amount) return this.addError('MonthlyLimitLessThanWeeklyLimitType')
      }
      const whereConditions = { responsibleGamblingType, userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE }
      if (limitType) whereConditions.limitType = limitType

      const existingSetting = await ResponsibleGamblingModel.findOne({ where: whereConditions })
      if (limitType) {
        if (limitType === '1') limitTypeTime = 'daily'
        else if (limitType === '2') limitTypeTime = 'weekly'
        else if (limitType === '3') limitTypeTime = 'monthly'
      }
      if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.BET) field = `${limitTypeTime} bet amount limit`
      else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE) field = `${limitTypeTime} purchase amount limit`

      let createOrUpdateSettings = {}
      if (existingSetting) {
        const updateData = {}
        if (
          existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.BET ||
        existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
        ) {
          if (!amount) { this.addError('LimitTypeOrAmountRequireType') }
          originalValue = existingSetting.amount
          changedValue = amount
          updateData.amount = amount

          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType,
            timeBreakDuration: null,
            selfExclusion: null,
            amount
          }
        } else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          if ((selfExclusion == null || selfExclusion === '')) { return this.addError('SelfExclusionRequireType') }

          field = 'Self Exclusion'
          originalValue = existingSetting.selfExclusion
          changedValue = selfExclusion
          updateData.selfExclusion = selfExclusion
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType: null,
            timeBreakDuration: null,
            selfExclusion,
            amount: null
          }
        } else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
          if (!timeBreakDuration) { this.addError('TimeBreakDurationRequireType') }

          field = 'Take a break'
          originalValue = existingSetting.timeBreakDuration
          changedValue = timeBreakDuration
          updateData.timeBreakDuration = timeBreakDuration
          updateData.amount = amount
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType: null,
            timeBreakDuration,
            selfExclusion: null,
            amount
          }
        }
        if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK || responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          const message = responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK ? 'You are in time break please contact admin' : 'You are self excluded please contact admin'
          await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE })
          await ResponsibleGamblingModel.create({ ...createOrUpdateSettings, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE })
          await forceLogoutService.run({ user, userId, reason, favorite })
          MultiLoginEmitter.emitMultiLogin({ message: message }, +userId)
          return { message: SUCCESS_MSG.UPDATE_SUCCESS }
        } else {
          await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE })
          await ResponsibleGamblingModel.create({ ...createOrUpdateSettings, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE })
          const storedToken = await getCachedData(`user:${userDetails.uniqueId}`)
          if (storedToken) {
            await removeData(`gamePlay:${userDetails.uniqueId}`)
          }
        }
      } else {
        const commonSettingCheck = { userId, responsibleGamblingType, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE }

        if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.BET || responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE) {
          if (!limitType || !amount) { this.addError('LimitTypeOrAmountRequireType') }
          commonSettingCheck.limitType = limitType
          changedValue = amount

          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType,
            timeBreakDuration: null,
            selfExclusion: null,
            amount
          }
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          if ((selfExclusion == null || selfExclusion === '')) { return this.addError('SelfExclusionRequireType') }

          field = 'Self Exclusion'
          changedValue = selfExclusion
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType: null,
            timeBreakDuration: null,
            selfExclusion,
            amount: null
          }
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
          if (!timeBreakDuration) { this.addError('TimeBreakDurationRequireType') }

          field = 'Take a break'
          changedValue = timeBreakDuration + ''
          createOrUpdateSettings = {
            userId,
            responsibleGamblingType,
            limitType: null,
            timeBreakDuration,
            selfExclusion: null,
            amount
          }
        }
        if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK || responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          const message = responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK ? 'You are in time break please contact admin' : 'You are self excluded please contact admin'
          await ResponsibleGamblingModel.create({ ...createOrUpdateSettings, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE })
          await forceLogoutService.run({ user, userId, reason, favorite })
          MultiLoginEmitter.emitMultiLogin({ message: message }, userId)
          return { message: SUCCESS_MSG.UPDATE_SUCCESS }
        } else {
          await ResponsibleGamblingModel.create({ ...createOrUpdateSettings, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE })
          const storedToken = await getCachedData(`user:${userDetails.uniqueId}`)
          if (storedToken) {
            await removeData(`gamePlay:${userDetails.uniqueId}`)
          }
          await activityLog({ user, userId, fieldChanged: field, originalValue, changedValue, favorite, remark: reason })
        }
      }
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
