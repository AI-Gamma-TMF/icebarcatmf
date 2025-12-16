import db, { sequelize as database, Sequelize } from '../../db/models'
import { divide, minus, round, times, plus } from 'number-precision'
import sequelize, { Op, QueryTypes } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import redisClient from '../../libs/redisClient'
import { adjustTimestampByTimezone, calculateDateTimeForAggregatedData } from '../../utils/common'
import { BONUS_TYPE, DASHBOARD_REPORT, TRANSACTION_STATUS, TRANSACTION_TYPE, WAGERING_TYPE } from '../../utils/constants/constant'

export class DashBoardReport extends ServiceBase {
  async run () {
    try {
      let { startDate, endDate, playerType, reportType, timezone = 'PST' } = this.args

      const internalUsers = (await db.User.findAll({ where: { isInternalUser: true }, attributes: ['userId'] })).map(obj => { return obj.userId })

      if (!startDate || !endDate) {
        startDate = new Date() // Current date and time
        startDate.setUTCHours(0, 0, 0, 0) // Set hours to zero
        startDate.setUTCMonth(startDate.getUTCMonth() - 3) // Subtract three months

        endDate = new Date() // Current date and time
        endDate.setUTCHours(0, 0, 0, 0) // Set hours to zero
      }

      // Adjusting time according to timezone
      startDate = adjustTimestampByTimezone(new Date(new Date(startDate).getUTCFullYear(), new Date(startDate).getUTCMonth(), new Date(startDate).getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)
      endDate = adjustTimestampByTimezone(new Date(new Date(endDate).getUTCFullYear(), new Date(endDate).getUTCMonth(), new Date(endDate).getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      // Define date ranges
      const currentDate = new Date()
      const today = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)
      const todayEnd = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      // Start of yesterday (00:00:00.000)
      const yesterdayStartDate = new Date()
      yesterdayStartDate.setUTCDate(yesterdayStartDate.getUTCDate() - 1)
      const yesterdayStart = adjustTimestampByTimezone(new Date(yesterdayStartDate.getUTCFullYear(), yesterdayStartDate.getUTCMonth(), yesterdayStartDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)
      const yesterdayEnd = adjustTimestampByTimezone(new Date(yesterdayStartDate.getUTCFullYear(), yesterdayStartDate.getUTCMonth(), yesterdayStartDate.getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      const startOfMonthDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
      const startOfMonth = adjustTimestampByTimezone(new Date(startOfMonthDate.getUTCFullYear(), startOfMonthDate.getUTCMonth(), startOfMonthDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)

      // Calculate the first day of the last month
      const startOfLastMonthDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1)
      const startOfLastMonth = adjustTimestampByTimezone(new Date(startOfLastMonthDate.getUTCFullYear(), startOfLastMonthDate.getUTCMonth(), startOfLastMonthDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)

      // Calculate the last day of the last month
      const endOfLastMonthDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0)
      const endOfLastMonth = adjustTimestampByTimezone(new Date(endOfLastMonthDate.getUTCFullYear(), endOfLastMonthDate.getUTCMonth(), endOfLastMonthDate.getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      // Calculate the metrics for each time period

      if (reportType === DASHBOARD_REPORT.LOGIN_DATA) {
        const {
          todayUniqueLoginCount,
          todayLoginCount,
          yesterdayUniqueLoginCount,
          yesterdayLoginCount,
          mtdUniqueLoginCount,
          mtdLoginCount,
          lastMonthUniqueLoginCount,
          lastMonthLoginCount,
          selectedDateUniqueLoginCount,
          selectedDateLoginCount
        } = await this.getLoginCount(today, todayEnd, yesterdayStart, yesterdayEnd, startOfMonth, startOfLastMonth, startDate, endDate, internalUsers, playerType)

        return {
          UNIQ_LOGIN: {
            TODAY: todayUniqueLoginCount,
            YESTERDAY: yesterdayUniqueLoginCount,
            MONTH_TO_DATE: mtdUniqueLoginCount,
            LAST_MONTH: lastMonthUniqueLoginCount,
            CUSTOM: selectedDateUniqueLoginCount
          },
          TOTAL_LOGIN: {
            TODAY: todayLoginCount,
            YESTERDAY: yesterdayLoginCount,
            MONTH_TO_DATE: mtdLoginCount,
            LAST_MONTH: lastMonthLoginCount,
            CUSTOM: selectedDateLoginCount
          }
        }
      }

      if (reportType === DASHBOARD_REPORT.LOGIN_DATA_TILL_DATE) {
        const { uniqueLoginCountTillDate, loginCountTillDate } = await this.getTillDateLoginCount(internalUsers, playerType)

        return {
          UNIQ_LOGIN: uniqueLoginCountTillDate,
          TOTAL_LOGIN: loginCountTillDate
        }
      }

      // customers data
      if (reportType === DASHBOARD_REPORT.CUSTOMER_DATA) {
        const [
          newRegistrationForToday,
          newRegistrationForYesterday,
          newRegistrationForMonthToDate,
          newRegistrationForLastMonth,
          newRegistrationForCustom,
          newRegistrationForTillDate,

          isFirstDepositForToday,
          isFirstDepositForYesterday,
          isFirstDepositForMonthToDate,
          isFirstDepositForLastMonth,
          isFirstDepositForCustom,
          isFirstDepositForTillDate,

          isFirstDepositAmountSumForToday,
          isFirstDepositAmountSumForYesterday,
          isFirstDepositAmountSumForMonthToDate,
          isFirstDepositAmountSumForLastMonth,
          isFirstDepositAmountSumForCustom,
          isFirstDepositAmountSumForTillDate,

          totalPurchaseAmountSumForToday,
          totalPurchaseAmountSumForYesterday,
          totalPurchaseAmountSumForMonthToDate,
          totalPurchaseAmountSumForLastMonth,
          totalPurchaseAmountSumForCustom,
          totalPurchaseAmountSumForTillDate,

          totalAveragePurchaseAmountForToday,
          totalAveragePurchaseAmountForYesterday,
          totalAveragePurchaseAmountMonthToDate,
          totalAveragePurchaseAmountForLastMonth,
          totalAveragePurchaseAmountForCustom,
          totalAveragePurchaseAmountForTillDate,

          totalPurchaseAmountCountForToday,
          totalPurchaseAmountCountForYesterday,
          totalPurchaseAmountCountForMonthToDate,
          totalPurchaseAmountCountForLastMonth,
          totalPurchaseAmountCountForCustom,
          totalPurchaseAmountCountForTillDate,

          approvalRedemptionAmountSumForToday,
          approvalRedemptionAmountSumForYesterday,
          approvalRedemptionAmountSumForMonthToDate,
          approvalRedemptionAmountSumForLastMonth,
          approvalRedemptionAmountSumForCustom,
          approvalRedemptionAmountSumForTillDate,

          requestRedemptionAmountSumForToday,
          requestRedemptionAmountSumForYesterday,
          requestRedemptionAmountSumForMonthToDate,
          requestRedemptionAmountSumForLastMonth,
          requestRedemptionAmountSumForCustom,
          requestRedemptionAmountSumForTillDate,

          requestRedemptioncountForToday,
          requestRedemptioncountForYesterday,
          requestRedemptioncountForMonthToDate,
          requestRedemptioncountForLastMonth,
          requestRedemptioncountForCustom,
          requestRedemptioncountForTillDate,

          pendingRedemptioncountForToday,
          pendingRedemptioncountForYesterday,
          pendingRedemptioncountForMonthToDate,
          pendingRedemptioncountForLastMonth,
          pendingRedemptioncountForCustom,
          pendingRedemptioncountForTillDate,

          totalPurchaseAmountSumForAddSCToday,
          totalPurchaseAmountSumForAddSCYesterday,
          totalPurchaseAmountSumForAddSCMonthTodate,
          totalPurchaseAmountSumForAddSCLastMonth,
          totalPurchaseAmountSumForAddSCLastCustom,
          totalPurchaseAmountSumForAddSCTillDate,

          totalPurchaseAmountSumForAddGCToday,
          totalPurchaseAmountSumForAddGCYesterday,
          totalPurchaseAmountSumForAddGCMonthTodate,
          totalPurchaseAmountSumForAddGCLastMonth,
          totalPurchaseAmountSumForAddGCLastCustom,
          totalPurchaseAmountSumForAddGCTillDate,

          totalPurchaseAmountSumForRemoveSCToday,
          totalPurchaseAmountSumForRemoveSCYesterday,
          totalPurchaseAmountSumForRemoveSCMonthTodate,
          totalPurchaseAmountSumForRemoveSCLastMonth,
          totalPurchaseAmountSumForRemoveSCLastCustom,
          totalPurchaseAmountSumForRemoveSCTillDate,

          totalPurchaseAmountSumForRemoveGCToday,
          totalPurchaseAmountSumForRemoveGCYesterday,
          totalPurchaseAmountSumForRemoveGCMonthTodate,
          totalPurchaseAmountSumForRemoveGCLastMonth,
          totalPurchaseAmountSumForRemoveGCLastCustom,
          totalPurchaseAmountSumForRemoveGCTillDate

        ] = await Promise.all([
          this.getCustomerDataCount(today, todayEnd, true, internalUsers, playerType),
          this.getCustomerDataCount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getCustomerDataCount(startOfMonth, todayEnd, true, internalUsers, playerType),
          this.getCustomerDataCount(startOfLastMonth, endOfLastMonth, true, internalUsers, playerType),
          this.getCustomerDataCount(startDate, endDate, true, internalUsers, playerType),
          this.getCustomerDataCount(new Date(0), todayEnd, true, internalUsers, playerType),

          this.getIsFirstDepositCount(today, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfMonth, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getIsFirstDepositCount(startDate, endDate, internalUsers, playerType),
          this.getIsFirstDepositCount(new Date(0), todayEnd, internalUsers, playerType),

          this.getIsFirstDepositAmountSum(today, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(startDate, endDate, internalUsers, playerType),
          this.getIsFirstDepositAmountSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalPurchaseAmountSum(today, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(startDate, endDate, internalUsers, playerType),
          this.getTotalPurchaseAmountSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getAveragePurchaseAmount(today, todayEnd, internalUsers, playerType),
          this.getAveragePurchaseAmount(yesterdayStart, yesterdayEnd, true, internalUsers, playerType),
          this.getAveragePurchaseAmount(startOfMonth, todayEnd, internalUsers, playerType),
          this.getAveragePurchaseAmount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getAveragePurchaseAmount(startDate, endDate, internalUsers, playerType),
          this.getAveragePurchaseAmount(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalPurchaseCount(today, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalPurchaseCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalPurchaseCount(startDate, endDate, internalUsers, playerType),
          this.getTotalPurchaseCount(new Date(0), todayEnd, internalUsers, playerType),

          this.getApprovalRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getApprovalRedemptionAmountSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getRequestRedemptionAmountSum(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionAmountSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getRequestRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfMonth, todayEnd, internalUsers, playerType),
          this.getRequestRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getRequestRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getRequestRedemptionCount(new Date(0), todayEnd, internalUsers, playerType),

          this.getPendingRedemptionCount(today, todayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfMonth, todayEnd, internalUsers, playerType),
          this.getPendingRedemptionCount(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getPendingRedemptionCount(startDate, endDate, internalUsers, playerType),
          this.getPendingRedemptionCount(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalAddSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddSctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalAddGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddGctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalRemoveSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveSctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalRemoveGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveGctSum(new Date(0), todayEnd, internalUsers, playerType)
        ])
        return {
          NEW_REGISTRATION: {
            TODAY: newRegistrationForToday,
            YESTERDAY: newRegistrationForYesterday,
            MONTH_TO_DATE: newRegistrationForMonthToDate,
            LAST_MONTH: newRegistrationForLastMonth,
            CUSTOM: newRegistrationForCustom,
            TILL_DATE: newRegistrationForTillDate
          },
          FIRST_DEPOSIT: {
            TODAY: isFirstDepositForToday,
            YESTERDAY: isFirstDepositForYesterday,
            MONTH_TO_DATE: isFirstDepositForMonthToDate,
            LAST_MONTH: isFirstDepositForLastMonth,
            CUSTOM: isFirstDepositForCustom,
            TILL_DATE: isFirstDepositForTillDate
          },
          FIRST_DEPOSIT_AMOUNT_SUM: {
            TODAY: isFirstDepositAmountSumForToday,
            YESTERDAY: isFirstDepositAmountSumForYesterday,
            MONTH_TO_DATE: isFirstDepositAmountSumForMonthToDate,
            LAST_MONTH: isFirstDepositAmountSumForLastMonth,
            CUSTOM: isFirstDepositAmountSumForCustom,
            TILL_DATE: isFirstDepositAmountSumForTillDate
          },
          PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForToday,
            YESTERDAY: totalPurchaseAmountSumForYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForMonthToDate,
            LAST_MONTH: totalPurchaseAmountSumForLastMonth,
            CUSTOM: totalPurchaseAmountSumForCustom,
            TILL_DATE: totalPurchaseAmountSumForTillDate
          },
          AVERAGE_PURCHASE_AMOUNT: {
            TODAY: totalAveragePurchaseAmountForToday,
            YESTERDAY: totalAveragePurchaseAmountForYesterday,
            MONTH_TO_DATE: totalAveragePurchaseAmountMonthToDate,
            LAST_MONTH: totalAveragePurchaseAmountForLastMonth,
            CUSTOM: totalAveragePurchaseAmountForCustom,
            TILL_DATE: totalAveragePurchaseAmountForTillDate
          },
          PURCHASE_AMOUNT_COUNT: {
            TODAY: totalPurchaseAmountCountForToday,
            YESTERDAY: totalPurchaseAmountCountForYesterday,
            MONTH_TO_DATE: totalPurchaseAmountCountForMonthToDate,
            LAST_MONTH: totalPurchaseAmountCountForLastMonth,
            CUSTOM: totalPurchaseAmountCountForCustom,
            TILL_DATE: totalPurchaseAmountCountForTillDate
          },
          APPROVAL_REDEMPTION_AMOUNT_SUM: {
            TODAY: approvalRedemptionAmountSumForToday,
            YESTERDAY: approvalRedemptionAmountSumForYesterday,
            MONTH_TO_DATE: approvalRedemptionAmountSumForMonthToDate,
            LAST_MONTH: approvalRedemptionAmountSumForLastMonth,
            CUSTOM: approvalRedemptionAmountSumForCustom,
            TILL_DATE: approvalRedemptionAmountSumForTillDate
          },
          REQUEST_REDEMPTION_AMOUNT_SUM: {
            TODAY: requestRedemptionAmountSumForToday,
            YESTERDAY: requestRedemptionAmountSumForYesterday,
            MONTH_TO_DATE: requestRedemptionAmountSumForMonthToDate,
            LAST_MONTH: requestRedemptionAmountSumForLastMonth,
            CUSTOM: requestRedemptionAmountSumForCustom,
            TILL_DATE: requestRedemptionAmountSumForTillDate
          },
          REQUEST_REDEMPTION_COUNT_SUM: {
            TODAY: requestRedemptioncountForToday,
            YESTERDAY: requestRedemptioncountForYesterday,
            MONTH_TO_DATE: requestRedemptioncountForMonthToDate,
            LAST_MONTH: requestRedemptioncountForLastMonth,
            CUSTOM: requestRedemptioncountForCustom,
            TILL_DATE: requestRedemptioncountForTillDate
          },
          PENDING_REDEMPTION_COUNT_SUM: {
            TODAY: pendingRedemptioncountForToday,
            YESTERDAY: pendingRedemptioncountForYesterday,
            MONTH_TO_DATE: pendingRedemptioncountForMonthToDate,
            LAST_MONTH: pendingRedemptioncountForLastMonth,
            CUSTOM: pendingRedemptioncountForCustom,
            TILL_DATE: pendingRedemptioncountForTillDate
          },
          ADD_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddSCToday,
            YESTERDAY: totalPurchaseAmountSumForAddSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddSCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForAddSCTillDate
          },
          ADD_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddGCToday,
            YESTERDAY: totalPurchaseAmountSumForAddGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddGCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForAddGCTillDate
          },
          REMOVE_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveSCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveSCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForRemoveSCTillDate
          },
          REMOVE_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveGCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveGCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForRemoveGCTillDate
          },
          GROSS_REVENUE: {
            TODAY: round(minus(+totalPurchaseAmountSumForToday, +approvalRedemptionAmountSumForToday), 2),
            YESTERDAY: round(minus(+totalPurchaseAmountSumForYesterday, +approvalRedemptionAmountSumForYesterday), 2),
            MONTH_TO_DATE: round(minus(+totalPurchaseAmountSumForMonthToDate, +approvalRedemptionAmountSumForMonthToDate), 2),
            LAST_MONTH: round(minus(+totalPurchaseAmountSumForLastMonth, +approvalRedemptionAmountSumForLastMonth), 2),
            CUSTOM: round(minus(+totalPurchaseAmountSumForCustom, +approvalRedemptionAmountSumForCustom), 2),
            TILL_DATE: round(minus(+totalPurchaseAmountSumForTillDate, +approvalRedemptionAmountSumForTillDate), 2)
          }
        }
      }
      // customers data
      if (reportType === DASHBOARD_REPORT.CUSTOMER_DATA_TEST) {
        const { aggregatedEndDate, sumStartDate } = calculateDateTimeForAggregatedData(todayEnd)
        const [
          newRegistrationForToday,
          newRegistrationForYesterday,
          newRegistrationForMonthToDate,
          newRegistrationForLastMonth,
          newRegistrationForCustom,
          newRegistrationForTillDate,
          newRegistrationCountSum,

          isFirstDepositForToday,
          isFirstDepositForYesterday,
          isFirstDepositForMonthToDate,
          isFirstDepositForLastMonth,
          isFirstDepositForCustom,
          isFirstDepositForTillDate,
          isFirstDepositCountSum,

          isFirstDepositAmountSumForToday,
          isFirstDepositAmountSumForYesterday,
          isFirstDepositAmountSumForMonthToDate,
          isFirstDepositAmountSumForLastMonth,
          isFirstDepositAmountSumForCustom,
          isFirstDepositAmountSumForTillDate,
          isFirstDepositAmountSum,

          totalPurchaseAmountSumForToday,
          totalPurchaseAmountSumForYesterday,
          totalPurchaseAmountSumForMonthToDate,
          totalPurchaseAmountSumForLastMonth,
          totalPurchaseAmountSumForCustom,
          totalPurchaseAmountSumForTillDate,
          totalPurchaseAmountSum,

          totalPurchaseAmountCountForToday,
          totalPurchaseAmountCountForYesterday,
          totalPurchaseAmountCountForMonthToDate,
          totalPurchaseAmountCountForLastMonth,
          totalPurchaseAmountCountForCustom,
          totalPurchaseAmountCountForTillDate,
          totalPurchaseAmountCount,

          approvalRedemptionAmountSumForToday,
          approvalRedemptionAmountSumForYesterday,
          approvalRedemptionAmountSumForMonthToDate,
          approvalRedemptionAmountSumForLastMonth,
          approvalRedemptionAmountSumForCustom,
          approvalRedemptionAmountSumForTillDate,
          approvalRedemptionAmountSum,

          requestRedemptionAmountSumForToday,
          requestRedemptionAmountSumForYesterday,
          requestRedemptionAmountSumForMonthToDate,
          requestRedemptionAmountSumForLastMonth,
          requestRedemptionAmountSumForCustom,
          requestRedemptionAmountSumForTillDate,
          requestRedemptionAmountSum,

          requestRedemptioncountForToday,
          requestRedemptioncountForYesterday,
          requestRedemptioncountForMonthToDate,
          requestRedemptioncountForLastMonth,
          requestRedemptioncountForCustom,
          requestRedemptioncountForTillDate,
          requestRedemptionCount,

          pendingRedemptioncountForToday,
          pendingRedemptioncountForYesterday,
          pendingRedemptioncountForMonthToDate,
          pendingRedemptioncountForLastMonth,
          pendingRedemptioncountForCustom,
          pendingRedemptioncountForTillDate,
          pendingRedemptionCount,

          totalPurchaseAmountSumForAddSCToday,
          totalPurchaseAmountSumForAddSCYesterday,
          totalPurchaseAmountSumForAddSCMonthTodate,
          totalPurchaseAmountSumForAddSCLastMonth,
          totalPurchaseAmountSumForAddSCLastCustom,
          totalPurchaseAmountSumForAddSCTillDate,

          totalPurchaseAmountSumForAddGCToday,
          totalPurchaseAmountSumForAddGCYesterday,
          totalPurchaseAmountSumForAddGCMonthTodate,
          totalPurchaseAmountSumForAddGCLastMonth,
          totalPurchaseAmountSumForAddGCLastCustom,
          totalPurchaseAmountSumForAddGCTillDate,

          totalPurchaseAmountSumForRemoveSCToday,
          totalPurchaseAmountSumForRemoveSCYesterday,
          totalPurchaseAmountSumForRemoveSCMonthTodate,
          totalPurchaseAmountSumForRemoveSCLastMonth,
          totalPurchaseAmountSumForRemoveSCLastCustom,
          totalPurchaseAmountSumForRemoveSCTillDate,

          totalPurchaseAmountSumForRemoveGCToday,
          totalPurchaseAmountSumForRemoveGCYesterday,
          totalPurchaseAmountSumForRemoveGCMonthTodate,
          totalPurchaseAmountSumForRemoveGCLastMonth,
          totalPurchaseAmountSumForRemoveGCLastCustom,
          totalPurchaseAmountSumForRemoveGCTillDate
        ] = await Promise.all([
          this.getRealTestRegisterUserCount(today, aggregatedEndDate, playerType),
          this.getRealTestRegisterUserCount(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestRegisterUserCount(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestRegisterUserCount(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestRegisterUserCount(startDate, endDate, playerType),
          this.getRealTestRegisterUserCount(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourRegistrationCount(sumStartDate, todayEnd, internalUsers, playerType, true),

          this.getRealTestFirstPurchaserUserCount(today, aggregatedEndDate, playerType),
          this.getRealTestFirstPurchaserUserCount(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestFirstPurchaserUserCount(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestFirstPurchaserUserCount(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestFirstPurchaserUserCount(startDate, endDate, playerType),
          this.getRealTestFirstPurchaserUserCount(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourFirstPurchaserCount(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestFirstPurchaserUserSum(today, aggregatedEndDate, playerType),
          this.getRealTestFirstPurchaserUserSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestFirstPurchaserUserSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestFirstPurchaserUserSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestFirstPurchaserUserSum(startDate, endDate, playerType),
          this.getRealTestFirstPurchaserUserSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourFirstPurchaserSum(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestPurchaserUserSum(today, aggregatedEndDate, playerType),
          this.getRealTestPurchaserUserSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestPurchaserUserSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestPurchaserUserSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestPurchaserUserSum(startDate, endDate, playerType),
          this.getRealTestPurchaserUserSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourPurchaserSum(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestPurchaserUserCount(today, aggregatedEndDate, playerType),
          this.getRealTestPurchaserUserCount(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestPurchaserUserCount(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestPurchaserUserCount(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestPurchaserUserCount(startDate, endDate, playerType),
          this.getRealTestPurchaserUserCount(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourPurchaserCount(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestApprovedRedemptionSum(today, aggregatedEndDate, playerType),
          this.getRealTestApprovedRedemptionSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestApprovedRedemptionSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestApprovedRedemptionSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestApprovedRedemptionSum(startDate, endDate, playerType),
          this.getRealTestApprovedRedemptionSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourApprovedRedemptionSum(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestRequestRedemptionSum(today, aggregatedEndDate, playerType),
          this.getRealTestRequestRedemptionSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestRequestRedemptionSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestRequestRedemptionSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestRequestRedemptionSum(startDate, endDate, playerType),
          this.getRealTestRequestRedemptionSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourRequestRedemptionSum(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestRequestRedemptionCount(today, aggregatedEndDate, playerType),
          this.getRealTestRequestRedemptionCount(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestRequestRedemptionCount(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestRequestRedemptionCount(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestRequestRedemptionCount(startDate, endDate, playerType),
          this.getRealTestRequestRedemptionCount(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourRequestRedemptionCount(sumStartDate, todayEnd, internalUsers, playerType),

          this.getRealTestRequestPendingCount(today, aggregatedEndDate, playerType),
          this.getRealTestRequestPendingCount(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestRequestPendingCount(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestRequestPendingCount(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestRequestPendingCount(startDate, endDate, playerType),
          this.getRealTestRequestPendingCount(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourPendingRedemptionCount(sumStartDate, todayEnd, internalUsers, playerType),

          this.getTotalAddSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalAddSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddSctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalAddGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalAddGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalAddGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalAddGctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalRemoveSctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalRemoveSctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveSctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveSctSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getTotalRemoveGctSum(today, todayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getTotalRemoveGctSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getTotalRemoveGctSum(startDate, endDate, internalUsers, playerType),
          this.getTotalRemoveGctSum(new Date(0), todayEnd, internalUsers, playerType)
        ])
        return {
          NEW_REGISTRATION: {
            TODAY: +round(+plus(+newRegistrationForToday, +newRegistrationCountSum), 2),
            YESTERDAY: newRegistrationForYesterday,
            MONTH_TO_DATE: +round(+plus(+newRegistrationForMonthToDate, +newRegistrationCountSum), 2),
            LAST_MONTH: newRegistrationForLastMonth,
            CUSTOM: newRegistrationForCustom,
            TILL_DATE: +round(+plus(+newRegistrationForTillDate, +newRegistrationCountSum), 2)
          },
          FIRST_DEPOSIT: {
            TODAY: +round(+plus(+isFirstDepositForToday, +isFirstDepositCountSum), 2),
            YESTERDAY: isFirstDepositForYesterday,
            MONTH_TO_DATE: +round(+plus(+isFirstDepositForMonthToDate, +isFirstDepositCountSum), 2),
            LAST_MONTH: isFirstDepositForLastMonth,
            CUSTOM: isFirstDepositForCustom,
            TILL_DATE: +round(+plus(+isFirstDepositForTillDate, +isFirstDepositCountSum), 2)
          },
          FIRST_DEPOSIT_AMOUNT_SUM: {
            TODAY: +round(+plus(+isFirstDepositAmountSumForToday, +isFirstDepositAmountSum), 2),
            YESTERDAY: +round(isFirstDepositAmountSumForYesterday, 2),
            MONTH_TO_DATE: +round(+plus(+isFirstDepositAmountSumForMonthToDate, +isFirstDepositCountSum), 2),
            LAST_MONTH: +round(isFirstDepositAmountSumForLastMonth, 2),
            CUSTOM: +round(isFirstDepositAmountSumForCustom, 2),
            TILL_DATE: +round(+plus(+isFirstDepositAmountSumForTillDate, +isFirstDepositCountSum), 2)
          },
          PURCHASE_AMOUNT_SUM: {
            TODAY: +round(+plus(+totalPurchaseAmountSumForToday, +totalPurchaseAmountSum), 2),
            YESTERDAY: +round(totalPurchaseAmountSumForYesterday, 2),
            MONTH_TO_DATE: +round(+plus(+totalPurchaseAmountSumForMonthToDate, +totalPurchaseAmountSum), 2),
            LAST_MONTH: +round(totalPurchaseAmountSumForLastMonth, 2),
            CUSTOM: +round(totalPurchaseAmountSumForCustom, 2),
            TILL_DATE: +round(+plus(+totalPurchaseAmountSumForTillDate, +totalPurchaseAmountSum), 2)
          },
          AVERAGE_PURCHASE_AMOUNT: {
            TODAY: +divide(+round(+plus(+totalPurchaseAmountSumForToday, +totalPurchaseAmountSum), 2), +round(+plus(+totalPurchaseAmountCountForToday, +totalPurchaseAmountCount), 2)).toFixed(2),
            YESTERDAY: +divide(totalPurchaseAmountSumForYesterday, totalPurchaseAmountCountForYesterday).toFixed(2),
            MONTH_TO_DATE: +divide(+round(+plus(+totalPurchaseAmountSumForMonthToDate, +totalPurchaseAmountSum), 2), +round(+plus(+totalPurchaseAmountCountForMonthToDate, +totalPurchaseAmountCount), 2)).toFixed(2),
            LAST_MONTH: +divide(totalPurchaseAmountSumForLastMonth, totalPurchaseAmountCountForLastMonth).toFixed(2),
            CUSTOM: +divide(totalPurchaseAmountSumForCustom, totalPurchaseAmountCountForCustom).toFixed(2),
            TILL_DATE: +divide(+round(+plus(+totalPurchaseAmountSumForTillDate, +totalPurchaseAmountSum), 2), +round(+plus(+totalPurchaseAmountCountForTillDate, +totalPurchaseAmountCount), 2)).toFixed(2)
          },
          PURCHASE_AMOUNT_COUNT: {
            TODAY: +round(+plus(+totalPurchaseAmountCountForToday, +totalPurchaseAmountCount), 2),
            YESTERDAY: totalPurchaseAmountCountForYesterday,
            MONTH_TO_DATE: +round(+plus(+totalPurchaseAmountCountForMonthToDate, +totalPurchaseAmountCount), 2),
            LAST_MONTH: totalPurchaseAmountCountForLastMonth,
            CUSTOM: totalPurchaseAmountCountForCustom,
            TILL_DATE: +round(+plus(+totalPurchaseAmountCountForTillDate, +totalPurchaseAmountCount), 2)
          },

          APPROVAL_REDEMPTION_AMOUNT_SUM: {
            TODAY: +round(+plus(+approvalRedemptionAmountSumForToday, +approvalRedemptionAmountSum), 2),
            YESTERDAY: +round(approvalRedemptionAmountSumForYesterday, 2),
            MONTH_TO_DATE: +round(+plus(+approvalRedemptionAmountSumForMonthToDate, +approvalRedemptionAmountSum), 2),
            LAST_MONTH: +round(approvalRedemptionAmountSumForLastMonth, 2),
            CUSTOM: +round(approvalRedemptionAmountSumForCustom, 2),
            TILL_DATE: +round(+plus(+approvalRedemptionAmountSumForTillDate, +approvalRedemptionAmountSum), 2)
          },
          REQUEST_REDEMPTION_AMOUNT_SUM: {
            TODAY: +round(+plus(+requestRedemptionAmountSumForToday, +requestRedemptionAmountSum), 2),
            YESTERDAY: +round(requestRedemptionAmountSumForYesterday, 2),
            MONTH_TO_DATE: +round(+plus(+requestRedemptionAmountSumForMonthToDate, +requestRedemptionAmountSum), 2),
            LAST_MONTH: +round(requestRedemptionAmountSumForLastMonth, 2),
            CUSTOM: +round(requestRedemptionAmountSumForCustom, 2),
            TILL_DATE: +round(+plus(+requestRedemptionAmountSumForTillDate, +requestRedemptionAmountSum), 2)
          },
          REQUEST_REDEMPTION_COUNT_SUM: {
            TODAY: +round(+plus(+requestRedemptioncountForToday, +requestRedemptionCount), 2),
            YESTERDAY: requestRedemptioncountForYesterday,
            MONTH_TO_DATE: +round(+plus(+requestRedemptioncountForMonthToDate, +requestRedemptionCount), 2),
            LAST_MONTH: requestRedemptioncountForLastMonth,
            CUSTOM: requestRedemptioncountForCustom,
            TILL_DATE: +round(+plus(+requestRedemptioncountForTillDate, +requestRedemptionCount), 2)
          },
          PENDING_REDEMPTION_COUNT_SUM: {
            TODAY: +round(+plus(+pendingRedemptioncountForToday, +pendingRedemptionCount), 2),
            YESTERDAY: pendingRedemptioncountForYesterday,
            MONTH_TO_DATE: +round(+plus(+pendingRedemptioncountForMonthToDate, +pendingRedemptionCount), 2),
            LAST_MONTH: pendingRedemptioncountForLastMonth,
            CUSTOM: pendingRedemptioncountForCustom,
            TILL_DATE: +round(+plus(+pendingRedemptioncountForTillDate, +pendingRedemptionCount), 2)
          },
          ADD_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddSCToday,
            YESTERDAY: totalPurchaseAmountSumForAddSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddSCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForAddSCTillDate
          },
          ADD_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForAddGCToday,
            YESTERDAY: totalPurchaseAmountSumForAddGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForAddGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForAddGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForAddGCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForAddGCTillDate
          },
          REMOVE_SC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveSCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveSCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveSCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveSCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveSCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForRemoveSCTillDate
          },
          REMOVE_GC_SUCCESS_PURCHASE_AMOUNT_SUM: {
            TODAY: totalPurchaseAmountSumForRemoveGCToday,
            YESTERDAY: totalPurchaseAmountSumForRemoveGCYesterday,
            MONTH_TO_DATE: totalPurchaseAmountSumForRemoveGCMonthTodate,
            LAST_MONTH: totalPurchaseAmountSumForRemoveGCLastMonth,
            CUSTOM: totalPurchaseAmountSumForRemoveGCLastCustom,
            TILL_DATE: totalPurchaseAmountSumForRemoveGCTillDate
          },
          GROSS_REVENUE: {
            TODAY: round(minus(+round(+plus(+totalPurchaseAmountSumForToday, +totalPurchaseAmountSum), 2), round(+plus(+approvalRedemptionAmountSumForToday, +approvalRedemptionAmountSum), 2)), 2),
            YESTERDAY: round(minus(+totalPurchaseAmountSumForYesterday, +approvalRedemptionAmountSumForYesterday), 2),
            MONTH_TO_DATE: round(minus(+round(+plus(+totalPurchaseAmountSumForMonthToDate, +totalPurchaseAmountSum), 2), round(+plus(+approvalRedemptionAmountSumForMonthToDate, +approvalRedemptionAmountSum), 2)), 2),
            LAST_MONTH: round(minus(+totalPurchaseAmountSumForLastMonth, +approvalRedemptionAmountSumForLastMonth), 2),
            CUSTOM: round(minus(+totalPurchaseAmountSumForCustom, +approvalRedemptionAmountSumForCustom), 2),
            TILL_DATE: round(minus(+round(+plus(+totalPurchaseAmountSumForTillDate, +totalPurchaseAmountSum), 2), round(+plus(+approvalRedemptionAmountSumForTillDate, +approvalRedemptionAmountSum), 2)), 2)
          }
        }
      }

      // transaction data
      if (reportType === DASHBOARD_REPORT.TRANSACTION_DATA_TEST) {
        const [
          activeGcPlayersTodayCount,
          activeGcPlayersYesterdayCount,
          activeGcPlayersMonthToDateCount,
          activeGcPlayersLastMonthCount,
          activeGcPlayersCustomCount,
          activeGcPlayersTillDate,

          activeScPlayersTodayCount,
          activeScPlayersYesterdayCount,
          activeScPlayersMonthToDateCount,
          activeScPlayersLastMonthCount,
          activeScPlayersCustomCount,
          activeScPlayersTillDate,

          scStakedTodayCount,
          scStakedYesterdayCount,
          scStakedMonthToDateCount,
          scStakedLastMonthCount,
          scStakedCustomCount,
          scStakedTillDate,

          scWinTodayCount,
          scWinYesterdayCount,
          scWinMonthToDateCount,
          scWinLastMonthCount,
          scWinCustomCount,
          scWinTillDate
        ] =
       await Promise.all([
         this.getActivePlayersCount(0, today, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, yesterdayStart, yesterdayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startOfMonth, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startOfLastMonth, endOfLastMonth, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, startDate, endDate, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(0, new Date(0), todayEnd, 'bet', internalUsers, playerType),

         this.getActivePlayersCount(1, today, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, yesterdayStart, yesterdayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startOfMonth, todayEnd, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startOfLastMonth, endOfLastMonth, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, startDate, endDate, 'bet', internalUsers, playerType),
         this.getActivePlayersCount(1, new Date(0), todayEnd, 'bet', internalUsers, playerType),

         this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(yesterdayStart, yesterdayEnd, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startOfMonth, todayEnd, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(startDate, endDate, internalUsers, playerType, 'bet'),
         this.getScTransactionSum(new Date(0), todayEnd, internalUsers, playerType, 'bet'),

         this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'win'),
         this.getScTransactionSum(yesterdayStart, yesterdayEnd, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startOfMonth, todayEnd, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType, 'win'),
         this.getScTransactionSum(startDate, endDate, internalUsers, playerType, 'win'),
         this.getScTransactionSum(new Date(0), todayEnd, internalUsers, playerType, 'win')
       ])
        return {
          ACTIVE_GC_PLAYER: {
            TODAY: activeGcPlayersTodayCount,
            YESTERDAY: activeGcPlayersYesterdayCount,
            MONTH_TO_DATE: activeGcPlayersMonthToDateCount,
            LAST_MONTH: activeGcPlayersLastMonthCount,
            CUSTOM: activeGcPlayersCustomCount,
            TILL_DATE: activeGcPlayersTillDate
          },
          ACTIVE_SC_PLAYER: {
            TODAY: activeScPlayersTodayCount,
            YESTERDAY: activeScPlayersYesterdayCount,
            MONTH_TO_DATE: activeScPlayersMonthToDateCount,
            LAST_MONTH: activeScPlayersLastMonthCount,
            CUSTOM: activeScPlayersCustomCount,
            TILL_DATE: activeScPlayersTillDate
          },
          SC_STAKED_TOTAL: {
            TODAY: scStakedTodayCount,
            YESTERDAY: scStakedYesterdayCount,
            MONTH_TO_DATE: scStakedMonthToDateCount,
            LAST_MONTH: scStakedLastMonthCount,
            CUSTOM: scStakedCustomCount,
            TILL_DATE: scStakedTillDate
          },
          SC_WIN_TOTAL: {
            TODAY: scWinTodayCount,
            YESTERDAY: scWinYesterdayCount,
            MONTH_TO_DATE: scWinMonthToDateCount,
            LAST_MONTH: scWinLastMonthCount,
            CUSTOM: scWinCustomCount,
            TILL_DATE: scWinTillDate
          },
          HOUSE_EDGE: {
            TODAY: this.roundToTwoDecimalPlaces(100 - (+scStakedTodayCount > 0 ? +round(times(divide(+scWinTodayCount, +scStakedTodayCount), 100), 2) : 0)),
            YESTERDAY: this.roundToTwoDecimalPlaces(100 - (+scStakedYesterdayCount > 0 ? +round(times(divide(+scWinYesterdayCount, +scStakedYesterdayCount), 100), 2) : 0)),
            MONTH_TO_DATE: this.roundToTwoDecimalPlaces(100 - (+scStakedMonthToDateCount > 0 ? +round(times(divide(+scWinMonthToDateCount, +scStakedMonthToDateCount), 100), 2) : 0)),
            LAST_MONTH: this.roundToTwoDecimalPlaces(100 - (+scStakedLastMonthCount > 0 ? +round(times(divide(+scWinLastMonthCount, +scStakedLastMonthCount), 100), 2) : 0)),
            CUSTOM: this.roundToTwoDecimalPlaces(100 - (+scStakedCustomCount > 0 ? +round(times(divide(+scWinCustomCount, +scStakedCustomCount), 100), 2) : 0)),
            TILL_DATE: this.roundToTwoDecimalPlaces(100 - (+scStakedTillDate > 0 ? +round(times(divide(+scWinTillDate, +scStakedTillDate), 100), 2) : 0))
          },
          SC_GGR_TOTAL: {
            TODAY: this.roundToTwoDecimalPlaces(scStakedTodayCount - scWinTodayCount),
            YESTERDAY: this.roundToTwoDecimalPlaces(scStakedYesterdayCount - scWinYesterdayCount),
            MONTH_TO_DATE: this.roundToTwoDecimalPlaces(scStakedMonthToDateCount - scWinMonthToDateCount),
            LAST_MONTH: this.roundToTwoDecimalPlaces(scStakedLastMonthCount - scWinLastMonthCount),
            CUSTOM: this.roundToTwoDecimalPlaces(scStakedCustomCount - scWinCustomCount),
            TILL_DATE: this.roundToTwoDecimalPlaces(scStakedTillDate - scWinTillDate)
          }
        }
      }
      // transaction data
      if (reportType === DASHBOARD_REPORT.TRANSACTION_DATA) {
        const { aggregatedEndDate, sumStartDate } = calculateDateTimeForAggregatedData(todayEnd)

        const [
          [scStakedTodayCount, scWinTodayCount],
          [scStakedYesterdayCount, scWinYesterdayCount],
          [scStakedMonthToDateCount, scWinMonthToDateCount],
          [scStakedLastMonthCount, scWinLastMonthCount],
          [scStakedCustomCount, scWinCustomCount],
          [scStakedTillDate, scWinTillDate],

          { scBetSum, scWinSum }
        ] =
       await Promise.all([
         this.getScTransactionSumTesting(today, aggregatedEndDate, internalUsers, playerType, true),
         this.getScTransactionSumTesting(yesterdayStart, yesterdayEnd, internalUsers, playerType),
         this.getScTransactionSumTesting(startOfMonth, aggregatedEndDate, internalUsers, playerType),
         this.getScTransactionSumTesting(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
         this.getScTransactionSumTesting(startDate, endDate, internalUsers, playerType),
         this.getScTransactionSumTesting(new Date(0), aggregatedEndDate, internalUsers, playerType),

         this.getLast1HourSCTransactionSum(sumStartDate, todayEnd, internalUsers, playerType)
       ])
        return {
          SC_STAKED_TOTAL: {
            TODAY: +round(+plus(+scStakedTodayCount, +scBetSum), 2),
            YESTERDAY: scStakedYesterdayCount,
            MONTH_TO_DATE: +round(+plus(+scStakedMonthToDateCount, +scBetSum), 2),
            LAST_MONTH: scStakedLastMonthCount,
            TILL_DATE: +round(+plus(+scStakedTillDate, +scBetSum), 2),
            CUSTOM: scStakedCustomCount
          },
          SC_WIN_TOTAL: {
            TODAY: +round(+plus(+scWinTodayCount, +scWinSum), 2),
            YESTERDAY: scWinYesterdayCount,
            MONTH_TO_DATE: +round(+plus(+scWinMonthToDateCount, +scWinSum), 2),
            LAST_MONTH: scWinLastMonthCount,
            TILL_DATE: +round(+plus(+scWinTillDate, +scWinSum), 2),
            CUSTOM: scWinCustomCount
          },
          HOUSE_EDGE: {
            TODAY: this.roundToTwoDecimalPlaces(100 - (+scStakedTodayCount > 0 ? +round(times(divide(+round(+plus(+scWinTodayCount, +scWinSum), 2), +round(+plus(+scStakedTodayCount, +scBetSum), 2)), 100), 2) : 0)),
            YESTERDAY: this.roundToTwoDecimalPlaces(100 - (+scStakedYesterdayCount > 0 ? +round(times(divide(+scWinYesterdayCount, +scStakedYesterdayCount), 100), 2) : 0)),
            MONTH_TO_DATE: this.roundToTwoDecimalPlaces(100 - (+scStakedMonthToDateCount > 0 ? +round(times(divide(+round(+plus(+scWinMonthToDateCount, +scWinSum), 2), +round(+plus(+scStakedMonthToDateCount, +scBetSum), 2)), 100), 2) : 0)),
            LAST_MONTH: this.roundToTwoDecimalPlaces(100 - (+scStakedLastMonthCount > 0 ? +round(times(divide(+scWinLastMonthCount, +scStakedLastMonthCount), 100), 2) : 0)),
            TILL_DATE: this.roundToTwoDecimalPlaces(100 - (+scStakedTillDate > 0 ? +round(times(divide(+round(+plus(+scWinTillDate, +scWinSum), 2), +round(+plus(+scStakedTillDate, +scBetSum), 2)), 100), 2) : 0)),
            CUSTOM: this.roundToTwoDecimalPlaces(100 - (+scStakedCustomCount > 0 ? +round(times(divide(+scWinCustomCount, +scStakedCustomCount), 100), 2) : 0))
          },
          SC_GGR_TOTAL: {
            TODAY: this.roundToTwoDecimalPlaces(+round(+plus(+scStakedTodayCount, +scBetSum), 2) - +round(+plus(+scWinTodayCount, +scWinSum), 2)),
            YESTERDAY: this.roundToTwoDecimalPlaces(scStakedYesterdayCount - scWinYesterdayCount),
            MONTH_TO_DATE: this.roundToTwoDecimalPlaces(+round(+plus(+scStakedMonthToDateCount, +scBetSum), 2) - +round(+plus(+scWinMonthToDateCount, +scWinSum), 2)),
            LAST_MONTH: this.roundToTwoDecimalPlaces(scStakedLastMonthCount - scWinLastMonthCount),
            TILL_DATE: this.roundToTwoDecimalPlaces(+round(+plus(+scStakedTillDate, +scBetSum), 2) - +round(+plus(+scWinTillDate, +scWinSum), 2)),
            CUSTOM: this.roundToTwoDecimalPlaces(scStakedCustomCount - scWinCustomCount)
          }
        }
      }
      // Dashboard report

      if (reportType === DASHBOARD_REPORT.DASHBOARD_REPORT) {
        const [
          scStakedTodayCount,
          scWinTodayCount,
          scAwardedTotalSumForToday,
          gcAwardedTotalSumForToday,
          currentlyLoggedIn,
          currentlyActivePlayer,
          { totalWalletScCoin, totalVaultScCoin }
        ] = await Promise.all([
          this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'bet'),
          this.getScTransactionSum(today, todayEnd, internalUsers, playerType, 'win'),
          this.getScAwardedTotalSum(today, todayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(today, todayEnd, internalUsers, playerType),
          this.getCurrentlyLoggedInUser(),
          this.getCurrentlyActivePlayer(),
          this.getLiveScAndVaultScCount()
        ])

        return {
          DASHBOARD_REPORT: {
            scStakedTodayCount,
            scWinTodayCount,
            scAwardedTotalSumForToday,
            gcAwardedTotalSumForToday,
            scGgr: this.roundToTwoDecimalPlaces(scStakedTodayCount - scWinTodayCount),
            netScGgr: round(minus(minus(+scStakedTodayCount, +scWinTodayCount), +scAwardedTotalSumForToday), 2),
            currentLogin: +currentlyLoggedIn || 0,
            activePlayersCount: +currentlyActivePlayer || 0,
            totalWalletScCoin,
            totalVaultScCoin
          }
        }
      }

      if (reportType === DASHBOARD_REPORT.DASHBOARD_REPORT_OPTIMIZED) {
        const { aggregatedEndDate, sumStartDate } = calculateDateTimeForAggregatedData(todayEnd)

        const [
          { scRealStakedSum, scRealWinSum, scTestStakedSum, scTestWinSum }, // Change this as per code standards
          { scBetSum, scWinSum },
          { totalWalletScCoin, totalVaultScCoin },
          scAwardedSum,
          gcAwardedSum, // GC & SC bonus of last hour calculate from one single DB call.
          { totalRealScAwarded, totalRealScBet, totalTestScAwarded, totalTestScBet } // Change this as per code standard
        ] = await Promise.all([
          this.getScTransactionSumFromDashboardReport(today, aggregatedEndDate, playerType),
          this.getLast1HourSCTransactionSum(sumStartDate, todayEnd, internalUsers, playerType),
          this.getLiveScAndVaultScCount(),
          this.getScAwardedTotalSum(sumStartDate, todayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(sumStartDate, todayEnd, internalUsers, playerType),
          this.getScGcAwardedTotalSumFromDashboardReportTable(today, aggregatedEndDate, playerType)
        ])

        const scStakedToday = playerType === 'real' ? scRealStakedSum : scTestStakedSum
        const scStakedTodayCount = +round(+plus(+scStakedToday, +scBetSum), 2)
        const scWinToday = playerType === 'real' ? scRealWinSum : scTestWinSum
        const scWinTodayCount = +round(+plus(+scWinToday, +scWinSum), 2)

        let scAwardedTotalSumForToday = playerType === 'real' ? totalRealScAwarded : totalTestScAwarded
        scAwardedTotalSumForToday = +round(+plus(+scAwardedTotalSumForToday, +scAwardedSum), 2)

        let gcAwardedTotalSumForToday = playerType === 'real' ? totalRealScBet : totalTestScBet
        gcAwardedTotalSumForToday = +round(+plus(+gcAwardedTotalSumForToday, +gcAwardedSum), 2)

        return {
          DASHBOARD_REPORT: {
            scStakedTodayCount,
            scWinTodayCount,
            scAwardedTotalSumForToday,
            gcAwardedTotalSumForToday,
            scGgr: this.roundToTwoDecimalPlaces(scStakedTodayCount - scWinTodayCount),
            netScGgr: round(minus(minus(+scStakedTodayCount, +scWinTodayCount), +scAwardedTotalSumForToday), 2),
            currentLogin: +this.getCurrentlyLoggedInUser() || 0, // no await
            activePlayersCount: +this.getCurrentlyActivePlayer() || 0, // no await
            totalWalletScCoin,
            totalVaultScCoin
          }
        }
      }

      // Coin Economy Data
      if (reportType === DASHBOARD_REPORT.ECONOMY_DATA) {
        const [
          gcCreditedPurchaseSumForToday,
          gcCreditedPurchaseSumForYesterday,
          gcCreditedPurchaseSumForMonthToDate,
          gcCreditedPurchaseSumForLastMonth,
          gcCreditedPurchaseSumForCustom,
          gcCreditedPurchaseSumForTillDate,

          scCreditedPurchaseSumForToday,
          scCreditedPurchaseSumForYesterday,
          scCreditedPurchaseSumForMonthToDate,
          scCreditedPurchaseSumForLastMonth,
          scCreditedPurchaseSumForCustom,
          scCreditedPurchaseSumForTillDate,

          gcAwardedTotalSumForToday,
          gcAwardedTotalSumForYesterday,
          gcAwardedTotalSumForMonthToDate,
          gcAwardedTotalSumForLastMonth,
          gcAwardedTotalSumForCustom,
          gcAwardedTotalSumForTillDate,

          scAwardedTotalSumForToday,
          scAwardedTotalSumForYesterday,
          scAwardedTotalSumForMonthToDate,
          scAwardedTotalSumForLastMonth,
          scAwardedTotalSumForCustom,
          scAwardedTotalSumForTillDate
        ] = await Promise.all([
          this.getGcCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
          this.getGcCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getGcCreditedPurchaseSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getGcCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getGcCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
          this.getGcCreditedPurchaseSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getScCreditedPurchaseSum(today, todayEnd, internalUsers, playerType),
          this.getScCreditedPurchaseSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getScCreditedPurchaseSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getScCreditedPurchaseSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getScCreditedPurchaseSum(startDate, endDate, internalUsers, playerType),
          this.getScCreditedPurchaseSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getGcAwardedTotalSum(today, todayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getGcAwardedTotalSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getGcAwardedTotalSum(startDate, endDate, internalUsers, playerType),
          this.getGcAwardedTotalSum(new Date(0), todayEnd, internalUsers, playerType),

          this.getScAwardedTotalSum(today, todayEnd, internalUsers, playerType),
          this.getScAwardedTotalSum(yesterdayStart, yesterdayEnd, internalUsers, playerType),
          this.getScAwardedTotalSum(startOfMonth, todayEnd, internalUsers, playerType),
          this.getScAwardedTotalSum(startOfLastMonth, endOfLastMonth, internalUsers, playerType),
          this.getScAwardedTotalSum(startDate, endDate, internalUsers, playerType),
          this.getScAwardedTotalSum(new Date(0), todayEnd, internalUsers, playerType)
        ])

        return {
          GC_CREDITED_PURCHASE: {
            TODAY: gcCreditedPurchaseSumForToday,
            YESTERDAY: gcCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: gcCreditedPurchaseSumForMonthToDate,
            LAST_MONTH: gcCreditedPurchaseSumForLastMonth,
            CUSTOM: gcCreditedPurchaseSumForCustom,
            TILL_DATE: gcCreditedPurchaseSumForTillDate
          },
          SC_CREDITED_PURCHASE: {
            TODAY: scCreditedPurchaseSumForToday,
            YESTERDAY: scCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: scCreditedPurchaseSumForMonthToDate,
            LAST_MONTH: scCreditedPurchaseSumForLastMonth,
            CUSTOM: scCreditedPurchaseSumForCustom,
            TILL_DATE: scCreditedPurchaseSumForTillDate
          },
          GC_AWARDED_TOTAL: {
            TODAY: gcAwardedTotalSumForToday,
            YESTERDAY: gcAwardedTotalSumForYesterday,
            MONTH_TO_DATE: gcAwardedTotalSumForMonthToDate,
            LAST_MONTH: gcAwardedTotalSumForLastMonth,
            CUSTOM: gcAwardedTotalSumForCustom,
            TILL_DATE: gcAwardedTotalSumForTillDate
          },
          SC_AWARDED_TOTAL: {
            TODAY: scAwardedTotalSumForToday,
            YESTERDAY: scAwardedTotalSumForYesterday,
            MONTH_TO_DATE: scAwardedTotalSumForMonthToDate,
            LAST_MONTH: scAwardedTotalSumForLastMonth,
            CUSTOM: scAwardedTotalSumForCustom,
            TILL_DATE: scAwardedTotalSumForTillDate
          }
        }
      }

      if (reportType === DASHBOARD_REPORT.ECONOMY_DATA_TEST) {
        //  Reduce the number of queries as well as data is wrong
        const { aggregatedEndDate, sumStartDate } = calculateDateTimeForAggregatedData(todayEnd)
        const [
          gcCreditedPurchaseSumForToday,
          gcCreditedPurchaseSumForYesterday,
          gcCreditedPurchaseSumForMonthToDate,
          gcCreditedPurchaseSumForLastMonth,
          gcCreditedPurchaseSumForCustom,
          gcCreditedPurchaseSumForTillDate,
          gcCreditedPurchaseSum,

          scCreditedPurchaseSumForToday,
          scCreditedPurchaseSumForYesterday,
          scCreditedPurchaseSumForMonthToDate,
          scCreditedPurchaseSumForLastMonth,
          scCreditedPurchaseSumForCustom,
          scCreditedPurchaseSumForTillDate,
          scCreditedPurchaseSum,

          gcAwardedTotalSumForToday,
          gcAwardedTotalSumForYesterday,
          gcAwardedTotalSumForMonthToDate,
          gcAwardedTotalSumForLastMonth,
          gcAwardedTotalSumForCustom,
          gcAwardedTotalSumForTillDate,
          gcAwardedTotalSum,

          scAwardedTotalSumForToday,
          scAwardedTotalSumForYesterday,
          scAwardedTotalSumForMonthToDate,
          scAwardedTotalSumForLastMonth,
          scAwardedTotalSumForCustom,
          scAwardedTotalSumForTillDate,
          scAwardedTotalSum
        ] = await Promise.all([
          this.getRealTestGcCreditPurchaseSum(today, aggregatedEndDate, playerType),
          this.getRealTestGcCreditPurchaseSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestGcCreditPurchaseSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestGcCreditPurchaseSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestGcCreditPurchaseSum(startDate, endDate, playerType),
          this.getRealTestGcCreditPurchaseSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourGcCreditPurchaseSum(sumStartDate, todayEnd, internalUsers, playerType, true),

          this.getRealTestScCreditPurchaseSum(today, aggregatedEndDate, playerType),
          this.getRealTestScCreditPurchaseSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestScCreditPurchaseSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestScCreditPurchaseSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestScCreditPurchaseSum(startDate, endDate, playerType),
          this.getRealTestScCreditPurchaseSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourScCreditPurchaseSum(sumStartDate, todayEnd, internalUsers, playerType, true),

          this.getRealTestGcAwardedTotalSum(today, aggregatedEndDate, playerType),
          this.getRealTestGcAwardedTotalSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestGcAwardedTotalSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestGcAwardedTotalSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestGcAwardedTotalSum(startDate, endDate, playerType),
          this.getRealTestGcAwardedTotalSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourGcAwardedTotalSum(sumStartDate, todayEnd, internalUsers, playerType, true),

          this.getRealTestScAwardedTotalSum(today, aggregatedEndDate, playerType),
          this.getRealTestScAwardedTotalSum(yesterdayStart, yesterdayEnd, playerType),
          this.getRealTestScAwardedTotalSum(startOfMonth, aggregatedEndDate, playerType),
          this.getRealTestScAwardedTotalSum(startOfLastMonth, endOfLastMonth, playerType),
          this.getRealTestScAwardedTotalSum(startDate, endDate, playerType),
          this.getRealTestScAwardedTotalSum(new Date(0), aggregatedEndDate, playerType),
          this.getLastOneHourScAwardedTotalSum(sumStartDate, todayEnd, internalUsers, playerType, true)
        ])

        return {
          GC_CREDITED_PURCHASE: {
            TODAY: +round(+plus(+gcCreditedPurchaseSumForToday, +gcCreditedPurchaseSum), 2),
            YESTERDAY: gcCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: +round(+plus(+gcCreditedPurchaseSumForMonthToDate, +gcCreditedPurchaseSum), 2),
            LAST_MONTH: gcCreditedPurchaseSumForLastMonth,
            CUSTOM: gcCreditedPurchaseSumForCustom,
            TILL_DATE: +round(+plus(+gcCreditedPurchaseSumForTillDate, +gcCreditedPurchaseSum), 2)
          },
          SC_CREDITED_PURCHASE: {
            TODAY: +round(+plus(+scCreditedPurchaseSumForToday, +scCreditedPurchaseSum), 2),
            YESTERDAY: scCreditedPurchaseSumForYesterday,
            MONTH_TO_DATE: +round(+plus(+scCreditedPurchaseSumForMonthToDate, +scCreditedPurchaseSum), 2),
            LAST_MONTH: scCreditedPurchaseSumForLastMonth,
            CUSTOM: scCreditedPurchaseSumForCustom,
            TILL_DATE: +round(+plus(+scCreditedPurchaseSumForTillDate, +scCreditedPurchaseSum), 2)
          },
          GC_AWARDED_TOTAL: {
            TODAY: +round(+plus(+gcAwardedTotalSumForToday, +gcAwardedTotalSum), 2),
            YESTERDAY: gcAwardedTotalSumForYesterday,
            MONTH_TO_DATE: +round(+plus(+gcAwardedTotalSumForMonthToDate, +gcAwardedTotalSum), 2),
            LAST_MONTH: gcAwardedTotalSumForLastMonth,
            CUSTOM: gcAwardedTotalSumForCustom,
            TILL_DATE: +round(+plus(+gcAwardedTotalSumForTillDate, +gcAwardedTotalSum), 2)
          },
          SC_AWARDED_TOTAL: {
            TODAY: +round(+plus(+scAwardedTotalSumForToday, +scAwardedTotalSum), 2),
            YESTERDAY: scAwardedTotalSumForYesterday,
            MONTH_TO_DATE: +round(+plus(+scAwardedTotalSumForMonthToDate, +scAwardedTotalSum), 2),
            LAST_MONTH: scAwardedTotalSumForLastMonth,
            CUSTOM: scAwardedTotalSumForCustom,
            TILL_DATE: +round(+plus(+scAwardedTotalSumForTillDate, +scAwardedTotalSum), 2)
          }
        }
      }
    } catch (error) {
      // Handle errors
      throw new Error('Error calculating metrics: ' + error.message)
    }
  }

  // This is being used
  async getLoginCount (todayStart, todayEnd, yesterdayStart, yesterdayEnd, startOfMonth, startOfLastMonth, startDate, endDate, internalUsers, playerType) {
    let condition = ''
    if (internalUsers.length > 0) {
      condition = `AND user_activities.user_id ${playerType === 'internal' ? 'IN' : 'NOT IN'} (:internalUsers)`
    }

    const query = `
          SELECT
            -- Today's Unique Logins
            COUNT(DISTINCT user_activities.user_id) FILTER ( WHERE user_activities.created_at >= :todayStart AND user_activities.created_at < :todayEnd ) AS "todayUniqueLoginCount",
            -- Today's Total Logins
            COUNT(user_activities.user_id) FILTER (WHERE user_activities.created_at >= :todayStart AND user_activities.created_at < :todayEnd) AS "todayLoginCount",
            -- Yesterday's Unique Logins
            COUNT(DISTINCT user_activities.user_id) FILTER (WHERE user_activities.created_at >= :yesterdayStart AND user_activities.created_at < :yesterdayEnd ) AS "yesterdayUniqueLoginCount",
            -- Yesterday's Total Logins
            COUNT(user_activities.user_id) FILTER (WHERE user_activities.created_at >= :yesterdayStart AND user_activities.created_at < :yesterdayEnd ) AS "yesterdayLoginCount",
            -- Month-To-Date (MTD) Unique Logins
            COUNT(DISTINCT user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startOfMonth AND user_activities.created_at < :todayEnd ) AS "mtdUniqueLoginCount",
            -- Month-To-Date (MTD) Total Logins
            COUNT(user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startOfMonth AND user_activities.created_at < :todayEnd ) AS "mtdLoginCount",
            -- Last Month's Unique Logins
            COUNT(DISTINCT user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startOfLastMonth AND user_activities.created_at < :startOfMonth ) AS "lastMonthUniqueLoginCount",
            -- Last Month's Total Logins
            COUNT(user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startOfLastMonth  AND user_activities.created_at < :startOfMonth ) AS "lastMonthLoginCount",
            -- selected date's Unique Logins
            COUNT(DISTINCT user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startDate AND user_activities.created_at < :endDate ) AS "selectedDateUniqueLoginCount",
            -- selected date's Total Logins
            COUNT(user_activities.user_id) FILTER (WHERE user_activities.created_at >= :startDate AND user_activities.created_at < :endDate ) AS "selectedDateLoginCount"
          FROM
            public.user_activities
          WHERE
            activity_type = 'login'
          ${condition};
        `

    const [loginCounts] = await database.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      raw: false,
      replacements: {
        todayStart,
        todayEnd,
        yesterdayStart,
        yesterdayEnd,
        startOfMonth,
        startOfLastMonth,
        startDate,
        endDate,
        internalUsers
      }
    })
    return loginCounts
  }

  // This is being used
  async getTillDateLoginCount (internalUsers, playerType) {
    let condition = ''
    if (internalUsers.length > 0) {
      condition = `AND user_activities.user_id ${playerType === 'internal' ? 'IN' : 'NOT IN'} (:internalUsers)`
    }
    const query = `
          SELECT
            COUNT(DISTINCT user_activities.user_id) AS "uniqueLoginCountTillDate",
            COUNT(user_activities.user_id) AS "loginCountTillDate"
          FROM
            public.user_activities
          WHERE
            activity_type = 'login'
          ${condition};
        `
    const [loginCounts] = await database.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      raw: false,
      replacements: {
        internalUsers
      }
    })
    return loginCounts
  }

  async getCustomerDataCount (startDate, endDate, isDistinct = false, internalUsers, playerType) {
    // Implement the query to get the Bet Count for the specified time period using Sequelize
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const customerCount = await db.User.count({
      distinct: isDistinct,
      col: 'userId',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })

    return +customerCount || 0
  }

  async getLiveScAndVaultScCount () {
    const [result] = await database.query(
      `
      SELECT
        ROUND(SUM(COALESCE(CAST(sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) AS total_wallet_sc_coin,
        ROUND(SUM(COALESCE(CAST(vault_sc_coin ->> 'bsc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'psc' AS NUMERIC), 0) + COALESCE(CAST(vault_sc_coin ->> 'wsc' AS NUMERIC), 0)), 2) AS total_vault_sc_coin
      FROM
        public.wallets
      `,
      {
        type: database.QueryTypes.SELECT
      })

    return {
      totalWalletScCoin: +result?.total_wallet_sc_coin || 0,
      totalVaultScCoin: +result?.total_vault_sc_coin || 0
    }
  }

  async getIsFirstDepositCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const isFirstDepositCount = await db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    })

    return +isFirstDepositCount || 0
  }

  async getIsFirstDepositAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }
    const isFirstDepositAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    }
    )

    return +isFirstDepositAmountSum?.toFixed(2) || 0
  }

  async getTotalPurchaseAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount',
      {
        where: {
          ...query,
          ...whereClause
        }
      })

    return +totalPurchaseAmountSum?.toFixed(2) || 0
  }

  async getAveragePurchaseAmount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const averagePurchaseAmount = await db.TransactionBanking.aggregate('amount', 'avg', {
      where: {
        ...query,
        ...whereClause
      }
    })
    return +round(+averagePurchaseAmount, 2) || 0
  }

  async getTotalAddSctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalAddScAmountSum = await db.TransactionBanking.sum('scCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_SC
        }
      })

    return +totalAddScAmountSum?.toFixed(2) || 0
  }

  async getTotalRemoveSctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalRemoveScAmountSum = await db.TransactionBanking.sum('scCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.REMOVE_SC
        }
      })

    return +totalRemoveScAmountSum?.toFixed(2) || 0
  }

  async getTotalAddGctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalAddGcAmountSum = await db.TransactionBanking.sum('gcCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_GC
        }
      })

    return +totalAddGcAmountSum?.toFixed(2) || 0
  }

  async getTotalRemoveGctSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const totalRemoveGcAmountSum = await db.TransactionBanking.sum('gcCoin',
      {
        where: {
          ...query,
          updatedAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.REMOVE_GC
        }
      })

    return +totalRemoveGcAmountSum?.toFixed(2) || 0
  }

  async getTotalPurchaseCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }
    const totalPurchaseCount = await db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause
      }
    })
    return +totalPurchaseCount || 0
  }

  async getApprovalRedemptionAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const approvalRedemptionAmountSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.WITHDRAW
        }
      })
    return +approvalRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getRequestRedemptionAmountSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountSum = await db.WithdrawRequest.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
        }
      })
    return +requestRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getRequestRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = await db.WithdrawRequest.count({
      col: 'withdraw_request_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return +requestRedemptionAmountCount || 0
  }

  async getPendingRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = await db.WithdrawRequest.count({
      col: 'withdraw_request_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
      }
    })
    return +requestRedemptionAmountCount || 0
  }

  async getGcCreditedPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'internal') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseGcSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(gc_coin)::numeric, 2)'), 'gc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return +CreditedPurchaseGcSum[0].dataValues.gc_coin || 0
  }

  async getScCreditedPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseScSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(sc_coin)::numeric, 2)'), 'sc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return +CreditedPurchaseScSum[0].dataValues.sc_coin || 0
  }

  async getGcAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    let transactionBankingQuery = ''
    if (playerType === 'internal') {
      query = { userId: { [Op.in]: internalUsers } }
      transactionBankingQuery = { actioneeId: { [Op.in]: internalUsers } }
    } else if (playerType === 'real') {
      query = { userId: { [Op.notIn]: internalUsers } }
      transactionBankingQuery = { actioneeId: { [Op.notIn]: internalUsers } }
    }
    const [gcAwardedTotalSum, gcPackageAwardedSum, gcAddedSum] = await Promise.all([
      db.CasinoTransaction.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(gc)::numeric, 2)'), 'gc']],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, ...Object.values(BONUS_TYPE)] }
        }
      }),
      db.TransactionBanking.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(bonus_gc)::numeric, 2)'), 'bonusGc']],
        where: {
          ...transactionBankingQuery,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      }),
      db.TransactionBanking.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'addGc']],
        where: {
          ...transactionBankingQuery,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_GC
        }
      })
    ])
    return +round(+plus(+round(+gcAwardedTotalSum[0].dataValues.gc, 2), +round(+gcPackageAwardedSum[0].dataValues.bonusGc, 2), +round(+gcAddedSum[0].dataValues.addGc, 2)), 2) || 0
  }

  async getScAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    let transactionBankingQuery = ''
    if (playerType === 'internal') {
      query = { userId: { [Op.in]: internalUsers } }
      transactionBankingQuery = { actioneeId: { [Op.in]: internalUsers } }
    } else if (playerType === 'real') {
      query = { userId: { [Op.notIn]: internalUsers } }
      transactionBankingQuery = { actioneeId: { [Op.notIn]: internalUsers } }
    }
    const [scAwardedTotalSum, scPackageAwardedSum, scAddedSum] = await Promise.all([
      db.CasinoTransaction.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(sc)::numeric, 2)'), 'sc']],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, ...Object.values(BONUS_TYPE)] }
        }
      }),
      db.TransactionBanking.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(bonus_sc)::numeric, 2)'), 'bonusSc']],
        where: {
          ...transactionBankingQuery,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      }),
      db.TransactionBanking.findAll({
        attributes: [[sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'addSc']],
        where: {
          ...transactionBankingQuery,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.ADD_SC
        }
      })
    ])
    return +round(+plus(round(+scAwardedTotalSum[0].dataValues.sc, 2), round(+scPackageAwardedSum[0].dataValues.bonusSc, 2), round(+scAddedSum[0].dataValues.addSc, 2)), 2) || 0
  }

  async getScGcAwardedTotalSumFromDashboardReportTable (startDate, endDate, playerType) {
    let selectQuery = `
      SUM(total_real_sc_awarded_amount) as "totalRealScAwarded", SUM(total_real_sc_stacked_amount) as "totalRealScBet"
    `
    if (playerType === 'internal') {
      selectQuery = 'SUM(total_test_sc_awarded_amount) as "totalTestScAwarded", SUM(total_test_gc_awarded_amount) as "totalTestScBet"'
    }

    const query = `
      SELECT
        ${selectQuery}
      FROM dashboard_reports
      where timestamp >= :startDate
      and timestamp < :endDate
    `
    const [data] = await database.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      raw: false,
      replacements: {
        startDate,
        endDate
      }
    })

    return data
  }

  async getTotalScBalanceSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { ownerId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { ownerId: { [Op.notIn]: internalUsers } }
    const TotalScBalance = await db.Wallet.sum(
      [
        Op.cast(Op.json('sc_coin.bsc'), 'NUMERIC'),
        Op.cast(Op.json('sc_coin.psc'), 'NUMERIC')
      ],
      {
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          }
        }
      })
    return +TotalScBalance || 0
  }

  async getActivePlayersCount (amountType, startDate, endDate, actionType, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    // Implement the query to count active players for a specific currency code
    const activePlayersCount = await db.CasinoTransaction.count({
      distinct: true,
      col: 'userId',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        amountType,
        actionType
      }
    })
    return +activePlayersCount || 0
  }

  async getActivePlayersCountTest (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = `AND "user_id" IN (${internalUsers})`
    else if (playerType === 'real') query = `AND "user_id" NOT IN (${internalUsers})`

    const [data] = await database.query(`
      WITH filtered_transactions AS (
        SELECT "user_id", "amount_type"
      FROM "public"."casino_transactions"
      WHERE 
        "amount_type" IN (0, 1)
        AND "action_type" = 'bet'
        AND "created_at" >= :startDate AND "created_at" <= :endDate
        ${query}
      GROUP BY "user_id", "amount_type"
      )
      SELECT COUNT (*), (CASE WHEN "amount_type" = 0 THEN 'GC' ELSE 'SC' END) AS "coin_type"
      FROM filtered_transactions
      GROUP BY "coin_type"
      ORDER BY "coin_type" ASC;
    `, {
      type: QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate
      }
    })
    return data ? [+data[0]?.count || 0, +data[1]?.count || 0] : [0, 0]
  }

  async getNewActiveScPlayersCount (startDate, endDate, internalUsers, playerType) {
    // Find all CasinoTransactions for the specified time period
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const casinoTransactions = await db.CasinoTransaction.findAll({
      where: {
        ...query,
        actionType: 'bet', // Assuming 'bet' represents a player placing a bet
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      },
      attributes: ['userId'],
      group: ['userId'],
      having: sequelize.literal('COUNT(*) = 1') // Only players with one bet
    })

    // Get the count of new active SC players
    const count = casinoTransactions.length

    return +count || 0
  }

  async getScTransactionSum (startDate, endDate, internalUsers, playerType, actionType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const scStakedAmountSum = await db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          actionType,
          amountType: 1
        }
      })

    return +scStakedAmountSum[0].dataValues.amount || 0
  }

  async getScTransactionSumFromDashboardReport (startDate, endDate, playerType) {
    let playerTypeQuery = `
      COALESCE(SUM(sc_real_staked_sum), 0) as "scRealStakedSum", 
      COALESCE(SUM(sc_real_win_sum), 0) as "scRealWinSum"
    `
    if (playerType === 'internal') {
      playerTypeQuery = `
        COALESCE(sum(sc_test_staked_sum), 0) as "scTestStakedSum", 
        COALESCE(sum(sc_test_win_sum), 0) as "scTestWinSum"
      `
    }

    const query = `
      SELECT
        ${playerTypeQuery}
      FROM dashboard_reports
      where timestamp >= :startDate
      and timestamp < :endDate
    `
    const [data] = await database.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      raw: false,
      replacements: {
        startDate,
        endDate
      }
    })

    return data
  }

  async getScTransactionSumTesting (startDate, endDate, internalUsers, playerType) {
    let select = 'ROUND(ROUND(SUM(sc_real_staked_sum)::NUMERIC, 2) + ROUND(SUM(sc_test_staked_sum)::NUMERIC, 2)) AS "scBetSum", ROUND(ROUND(SUM(sc_real_win_sum)::NUMERIC, 2) + ROUND(SUM(sc_test_win_sum)::NUMERIC, 2), 2) AS "scWinSum"'
    if (playerType === 'internal') select = 'ROUND(SUM(sc_test_staked_sum)::NUMERIC, 2) AS "scBetSum", ROUND(SUM(sc_test_win_sum)::NUMERIC, 2) AS "scWinSum"'
    else if (playerType === 'real') select = 'ROUND(SUM(sc_real_staked_sum):: NUMERIC, 2) AS "scBetSum", ROUND(SUM(sc_real_win_sum)::NUMERIC, 2) AS "scWinSum"'
    const [[{ scBetSum, scWinSum }]] = await database.query(`SELECT ${select} FROM public.dashboard_reports WHERE "timestamp" BETWEEN :startDate AND :endDate`, {
      types: QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate
      }
    })

    return [+scBetSum || 0, +scWinSum || 0]
  }

  roundToTwoDecimalPlaces (num) { return +round(+num, 2) }

  async getLast1HourSCTransactionSum (startDate, endDate, internalUsers, playerType) {
    let query
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }

    const [{ scBetSum, scWinSum }] = await db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal("ROUND(SUM(CASE WHEN action_type= 'bet' THEN amount ELSE 0 END)::numeric, 2)"), 'scBetSum'],
          [sequelize.literal("ROUND(SUM(CASE WHEN action_type= 'win' THEN amount ELSE 0 END)::numeric, 2)"), 'scWinSum']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          amountType: 1
        },
        raw: true
      })

    return { scBetSum: +scBetSum || 0, scWinSum: +scWinSum || 0 }
  }

  async getCurrentlyLoggedInUser () {
    const { client } = redisClient // Get the Redis client instance
    let cursor = '0'
    let keys = 0

    try {
      do {
        const [newCursor, results] = await client.scan(cursor, 'MATCH', 'user:*')
        cursor = newCursor
        keys += results.length
      } while (cursor !== '0')
    } catch (error) {
      console.log(error)
    }

    return +keys
  }

  async getRealTestRegisterUserCount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealRegisteredPlayerCount'
    } else if (playerType === 'internal') {
      column = 'totalTestRegisteredPlayerCount'
    }
    const registerCount = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return registerCount || 0
  }

  async getLastOneHourRegistrationCount (startDate, endDate, internalUsers, playerType, distinct) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const registerCount = await db.User.count({
      distinct: distinct,
      col: 'userId',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return +registerCount || 0
  }

  async getRealTestFirstPurchaserUserCount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealFirstTimePurchaserCount'
    } else if (playerType === 'internal') {
      column = 'totalTestFirstTimePurchaserCount'
    }
    const isFirstDepositCount = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return isFirstDepositCount || 0
  }

  async getLastOneHourFirstPurchaserCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      updatedAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const isFirstDepositCount = await db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    })

    return +isFirstDepositCount || 0
  }

  async getRealTestFirstPurchaserUserSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealFirstTimePurchaserAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestFirstTimePurchaserAmount'
    }
    const isFirstDepositAmountSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return isFirstDepositAmountSum || 0
  }

  async getLastOneHourFirstPurchaserSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      updatedAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }
    const isFirstDepositAmountSum = await db.TransactionBanking.sum('amount', {
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    }
    )

    return +isFirstDepositAmountSum?.toFixed(2) || 0
  }

  async getRealTestPurchaserUserCount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealPurchaseCount'
    } else if (playerType === 'internal') {
      column = 'totalTestPurchaseCount'
    }
    const depositCount = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return depositCount || 0
  }

  async getLastOneHourPurchaserCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      updatedAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const depositCount = await db.TransactionBanking.count({
      col: 'transaction_banking_id',
      where: {
        ...query,
        ...whereClause,
        isFirstDeposit: true
      }
    })

    return +depositCount || 0
  }

  async getRealTestPurchaserUserSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealPurchaseAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestPurchaseAmount'
    }
    const depositAmountSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return depositAmountSum || 0
  }

  async getLastOneHourPurchaserSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      updatedAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }
    const totalPurchaseAmountSum = await db.TransactionBanking.sum('amount',
      {
        where: {
          ...query,
          ...whereClause
        }
      })

    return +totalPurchaseAmountSum?.toFixed(2) || 0
  }

  async getRealTestApprovedRedemptionSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealApprovedRedemptionAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestApprovedRedemptionAmount'
    }
    const approvalRedemptionAmountSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return approvalRedemptionAmountSum || 0
  }

  async getLastOneHourApprovedRedemptionSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const approvalRedemptionAmountSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.WITHDRAW
        }
      })
    return +approvalRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getRealTestRequestRedemptionSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealRequestRedemptionAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestRequestRedemptionAmount'
    }
    const requestedRedemptionAmountSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return requestedRedemptionAmountSum || 0
  }

  async getLastOneHourRequestRedemptionSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountSum = await db.WithdrawRequest.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
        }
      })
    return +requestRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getRealTestRequestPendingCount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealPendingRedemptionCount'
    } else if (playerType === 'internal') {
      column = 'totalTestPendingRedemptionCount'
    }
    const pendingRedemptionAmountSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return pendingRedemptionAmountSum || 0
  }

  async getLastOneHourPendingRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = await db.WithdrawRequest.count({
      col: 'withdraw_request_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] }
      }
    })
    return +requestRedemptionAmountCount || 0
  }

  async getRealTestRequestRedemptionCount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealRedemptionCount'
    } else if (playerType === 'internal') {
      column = 'totalTestRedemptionCount'
    }
    const requestRedemptionCount = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return requestRedemptionCount || 0
  }

  async getLastOneHourRequestRedemptionCount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const requestRedemptionAmountCount = await db.WithdrawRequest.count({
      col: 'withdraw_request_id',
      where: {
        ...query,
        createdAt: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return +requestRedemptionAmountCount || 0
  }

  async getRealTestAveragePurchaseAmount (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealAveragePurchaseAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestAveragePurchaseAmount'
    }
    const avgPurchaseAmount = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return avgPurchaseAmount || 0
  }

  async getLastOneHourAveragePurchaseAmount (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      updatedAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    }

    const averagePurchaseAmount = await db.TransactionBanking.aggregate('amount', 'avg', {
      where: {
        ...query,
        ...whereClause
      }
    })
    return +round(+averagePurchaseAmount, 2) || 0
  }

  async getRealTestGcCreditPurchaseSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealGcCreditPurchaseAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestGcCreditPurchaseAmount'
    }
    const gcCreditPurchaseSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return gcCreditPurchaseSum || 0
  }

  async getLastOneHourGcCreditPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'internal') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseGcSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(gc_coin)::numeric, 2)'), 'gc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return +CreditedPurchaseGcSum[0].dataValues.gc_coin || 0
  }

  async getRealTestScCreditPurchaseSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealGcCreditPurchaseAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestGcCreditPurchaseAmount'
    }
    const scPurchaseSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return scPurchaseSum || 0
  }

  async getLastOneHourScCreditPurchaseSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { actioneeId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { actioneeId: { [Op.notIn]: internalUsers } }
    const CreditedPurchaseScSum = await db.TransactionBanking.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(sc_coin)::numeric, 2)'), 'sc_coin']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.DEPOSIT
        }
      })
    return +CreditedPurchaseScSum[0].dataValues.sc_coin || 0
  }

  async getRealTestGcAwardedTotalSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealGcAwardedAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestGcAwardedAmount'
    }
    const scPurchaseSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return scPurchaseSum || 0
  }

  async getLastOneHourGcAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const GcAwardedTotalSum = await db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(gc)::numeric, 2)'), 'gc']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, ...Object.values(BONUS_TYPE)] }
        }
      })
    return +GcAwardedTotalSum[0].dataValues.gc || 0
  }

  async getRealTestScAwardedTotalSum (startDate, endDate, playerType) {
    let column
    if (playerType === 'real') {
      column = 'totalRealScAwardedAmount'
    } else if (playerType === 'internal') {
      column = 'totalTestScAwardedAmount'
    }
    const scAwardedSum = await db.DashboardReport.sum(column, {
      where: {
        timestamp: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }
    })
    return scAwardedSum || 0
  }

  async getLastOneHourScAwardedTotalSum (startDate, endDate, internalUsers, playerType) {
    let query = ''
    if (playerType === 'internal') query = { userId: { [Op.in]: internalUsers } }
    else if (playerType === 'real') query = { userId: { [Op.notIn]: internalUsers } }
    const ScAwardedTotalSum = await db.CasinoTransaction.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(sc)::numeric, 2)'), 'sc']
        ],
        where: {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          actionType: { [Op.in]: [WAGERING_TYPE.BONUS, ...Object.values(BONUS_TYPE)] }
        }
      })
    return +ScAwardedTotalSum[0].dataValues.sc || 0
  }

  async getCurrentlyActivePlayer () {
    const { client } = redisClient // Get the Redis client instance
    let cursor = '0'
    let keys = 0

    try {
      do {
        const [newCursor, results] = await client.scan(cursor, 'MATCH', 'gamePlay-*')
        cursor = newCursor
        keys += results.length
      } while (cursor !== '0')
    } catch (error) {
      console.log(error)
    }

    return +keys
  }
}
