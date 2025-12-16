import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { adjustTimestampByTimezone } from '../../utils/common'
import { Op } from 'sequelize'
import { round, plus, minus, divide } from 'number-precision'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

export class GetVipManagerReportService extends ServiceBase {
  async run () {
    const { dbModels: { UserInternalRating: UserInternalRatingModel } } = this.context
    const { managerAdminId, startDate, endDate, timezone, vipStatusSearch } = this.args
    let managedBy
    if (managerAdminId) {
      try {
        const parsedManagerAdminId = JSON.parse(managerAdminId)
        if (Array.isArray(parsedManagerAdminId)) {
          managedBy = parsedManagerAdminId
        } else {
          managedBy = +parsedManagerAdminId
        }
      } catch (e) {
        // fallback: if not JSON, treat it as a single numeric value
        managedBy = +managerAdminId
      }
    }
    // ---------------- VIP Users (only if vipStatusSearch exists) ----------------
    let vipUsers = null

    if (vipStatusSearch) {
      const whereClause = { vipStatus: vipStatusSearch }

      if (managerAdminId) {
        if (Array.isArray(managedBy)) {
          whereClause.managedBy = { [Op.in]: managedBy }
        } else {
          whereClause.managedBy = managedBy
        }
      }

      vipUsers = (
        await UserInternalRatingModel.findAll({
          where: whereClause,
          attributes: ['userId'],
          raw: true
        })
      ).map(obj => obj.userId)
    }

    // ---------------- Custom Start/End ----------------
    const customStart = startDate
      ? adjustTimestampByTimezone(
          new Date(new Date(startDate).getUTCFullYear(), new Date(startDate).getUTCMonth(), new Date(startDate).getUTCDate(), 0, 0, 0, 0).toISOString(),
          timezone
        )
      : adjustTimestampByTimezone(
        new Date(new Date().getUTCFullYear(), new Date().getUTCMonth() - 3, new Date().getUTCDate(), 0, 0, 0, 0).toISOString(),
        timezone
      )

    const customEnd = endDate
      ? adjustTimestampByTimezone(
          new Date(new Date(endDate).getUTCFullYear(), new Date(endDate).getUTCMonth(), new Date(endDate).getUTCDate(), 23, 59, 59, 999).toISOString(),
          timezone
        )
      : adjustTimestampByTimezone(
        new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 23, 59, 59, 999).toISOString(),
        timezone
      )

    // ---------------- Derived Date Ranges ----------------
    const currentDate = new Date()

    // Today end
    const todayEnd = adjustTimestampByTimezone(
      new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999).toISOString(),
      timezone
    )

    // Month to date
    const startOfMonthDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
    const startOfMonth = adjustTimestampByTimezone(
      new Date(startOfMonthDate.getUTCFullYear(), startOfMonthDate.getUTCMonth(), startOfMonthDate.getUTCDate(), 0, 0, 0, 0).toISOString(),
      timezone
    )

    // Last 7 days
    const sevenDaysAgoDate = new Date(currentDate)
    sevenDaysAgoDate.setUTCDate(currentDate.getUTCDate() - 6)
    const last7DaysStart = adjustTimestampByTimezone(
      new Date(sevenDaysAgoDate.getUTCFullYear(), sevenDaysAgoDate.getUTCMonth(), sevenDaysAgoDate.getUTCDate(), 0, 0, 0, 0).toISOString(),
      timezone
    )
    const last7DaysEnd = todayEnd

    // Year to date
    const startOfThisYear = adjustTimestampByTimezone(
      new Date(currentDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0).toISOString(),
      timezone
    )

    // Last month
    const lastMonth = new Date(currentDate)
    lastMonth.setUTCMonth(lastMonth.getUTCMonth() - 1)
    const startOfLastMonthDate = new Date(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth(), 1)
    const endOfLastMonthDate = new Date(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth() + 1, 0)
    const startOfLastMonth = adjustTimestampByTimezone(
      new Date(startOfLastMonthDate.getUTCFullYear(), startOfLastMonthDate.getUTCMonth(), startOfLastMonthDate.getUTCDate(), 0, 0, 0, 0).toISOString(),
      timezone
    )
    const endOfLastMonth = adjustTimestampByTimezone(
      new Date(endOfLastMonthDate.getUTCFullYear(), endOfLastMonthDate.getUTCMonth(), endOfLastMonthDate.getUTCDate(), 23, 59, 59, 999).toISOString(),
      timezone
    )

    // ---------------- Period Map ----------------
    const periods = {
      CUSTOM_DATE: { start: customStart, end: customEnd },
      MONTH_TO_DATE: { start: startOfMonth, end: todayEnd },
      LAST_MONTH: { start: startOfLastMonth, end: endOfLastMonth },
      LAST_WEEK: { start: last7DaysStart, end: last7DaysEnd },
      YEAR_TO_DATE: { start: startOfThisYear, end: todayEnd }
    }

    // ---------------- Collect Data for Periods ----------------
    const whaleData = {}
    // const pendingRedemption = {}
    const vaultBalances = {}

    for (const [label, { start, end }] of Object.entries(periods)) {
      const whaleResult = await this.getWhalePlayerSums(start, end, managedBy, vipUsers)

      whaleData[label] = whaleResult

      // only proceed if we have users
      if (whaleResult.userIds.length) {
        // pendingRedemption[label] = await this.getPendingRedemptionAmountSum(start, end, whaleResult.userIds)
        vaultBalances[label] = await this.getUsersVaultBalance(start, end, whaleResult.userIds)
      } else {
        // pendingRedemption[label] = 0
        vaultBalances[label] = { currentScBalance: 0, vaultScBalance: 0 }
      }
    }

    // ---------------- Months count (for Monthly Avg) ----------------
    const currentYear = currentDate.getUTCFullYear()
    const currentMonth = currentDate.getUTCMonth() // 0-indexed (0 = Jan)
    const currentDay = currentDate.getUTCDate()

    // Get full months completed before the current month
    const fullMonths = currentMonth

    // Get days in the current month
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getUTCDate()

    // Calculate partial month
    const partialMonth = currentDay / daysInCurrentMonth

    const totalMonths = fullMonths + partialMonth

    // ---------------- Final Report ----------------
    const finalReport = {
      SC_GGR_TOTAL: {
        CUSTOM_DATE: +round(minus(whaleData.CUSTOM_DATE.totalScBetAmount, whaleData.CUSTOM_DATE.totalScWinAmount), 2),
        MONTH_TO_DATE: +round(minus(whaleData.MONTH_TO_DATE.totalScBetAmount, whaleData.MONTH_TO_DATE.totalScWinAmount), 2),
        LAST_MONTH: +round(minus(whaleData.LAST_MONTH.totalScBetAmount, whaleData.LAST_MONTH.totalScWinAmount), 2),
        LAST_WEEK: +round(minus(whaleData.LAST_WEEK.totalScBetAmount, whaleData.LAST_WEEK.totalScWinAmount), 2),
        YEAR_TO_DATE: +round(minus(whaleData.YEAR_TO_DATE.totalScBetAmount, whaleData.YEAR_TO_DATE.totalScWinAmount), 2),
        MONTHLY_AVERAGE:
          +round(
            divide(round(minus(whaleData.YEAR_TO_DATE.totalScBetAmount, whaleData.YEAR_TO_DATE.totalScWinAmount), 2), Number(totalMonths.toFixed(2))),
            2
          ) || 0
      },
      SC_NGR_TOTAL: {
        CUSTOM_DATE: +round(
          minus(
            whaleData.CUSTOM_DATE.totalPurchaseAmount,
            plus(
              whaleData.CUSTOM_DATE.totalRedemptionAmount,
              // pendingRedemption.CUSTOM_DATE,
              vaultBalances.CUSTOM_DATE.currentScBalance,
              vaultBalances.CUSTOM_DATE.vaultScBalance
            )
          ),
          2
        ),
        MONTH_TO_DATE: +round(
          minus(
            whaleData.MONTH_TO_DATE.totalPurchaseAmount,
            plus(
              whaleData.MONTH_TO_DATE.totalRedemptionAmount,
              // pendingRedemption.MONTH_TO_DATE,
              vaultBalances.MONTH_TO_DATE.currentScBalance,
              vaultBalances.MONTH_TO_DATE.vaultScBalance
            )
          ),
          2
        ),
        LAST_WEEK: +round(
          minus(
            whaleData.LAST_WEEK.totalPurchaseAmount,
            plus(
              whaleData.LAST_WEEK.totalRedemptionAmount,
              // pendingRedemption.LAST_WEEK,
              vaultBalances.LAST_WEEK.currentScBalance,
              vaultBalances.LAST_WEEK.vaultScBalance
            )
          ),
          2
        ),
        LAST_MONTH: +round(
          minus(
            whaleData.LAST_MONTH.totalPurchaseAmount,
            plus(
              whaleData.LAST_MONTH.totalRedemptionAmount,
              // pendingRedemption.LAST_MONTH,
              vaultBalances.LAST_MONTH.currentScBalance,
              vaultBalances.LAST_MONTH.vaultScBalance
            )
          ),
          2
        ),
        YEAR_TO_DATE: +round(
          minus(
            whaleData.YEAR_TO_DATE.totalPurchaseAmount,
            plus(
              whaleData.YEAR_TO_DATE.totalRedemptionAmount,
              // pendingRedemption.YEAR_TO_DATE,
              vaultBalances.YEAR_TO_DATE.currentScBalance,
              vaultBalances.YEAR_TO_DATE.vaultScBalance
            )
          ),
          2
        ),
        MONTHLY_AVERAGE:
          +round(
            minus(
              round(divide(whaleData.YEAR_TO_DATE.totalPurchaseAmount, Number(totalMonths.toFixed(2))), 2),
              plus(
                round(divide(whaleData.YEAR_TO_DATE.totalRedemptionAmount, Number(totalMonths.toFixed(2))), 2),
                round(divide(vaultBalances.YEAR_TO_DATE.currentScBalance, Number(totalMonths.toFixed(2))), 2),
                round(divide(vaultBalances.YEAR_TO_DATE.vaultScBalance, Number(totalMonths.toFixed(2))), 2)
                // round(divide(pendingRedemption.YEAR_TO_DATE, Number(totalMonths.toFixed(2))), 2)
              )
            ),
            2
          ) || 0
      }
    }

    return {
      data: finalReport,
      status: true,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }

  // ---------------- Helper Methods ----------------
  async getPendingRedemptionAmountSum (startDate, endDate, vipUsersList) {
    const { dbModels: { WithdrawRequest }, sequelize } = this.context
    const requestRedemptionAmountSum = await WithdrawRequest.findAll({
      attributes: [[sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] },
        userId: { [Op.in]: vipUsersList }
      }
    })
    return +requestRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getUsersVaultBalance (startDate, endDate, vipUsersList) {
    const { dbModels: { Wallet: WalletModel }, sequelize } = this.context

    const result = await WalletModel.findOne({
      attributes: [
        [sequelize.literal("ROUND((vault_sc_coin->>'bsc')::numeric + (vault_sc_coin->>'psc')::numeric + (vault_sc_coin->>'wsc')::numeric, 2)"), 'vaultScBalance'],
        [sequelize.literal("ROUND((sc_coin->>'bsc')::numeric +  (sc_coin->>'psc')::numeric +  (sc_coin->>'wsc')::numeric, 2)"), 'currentScBalance']
      ],
      where: {
        // createdAt: {
        //   [Op.and]: {
        //     [Op.gte]: startDate,
        //     [Op.lte]: endDate
        //   }
        // },
        ownerId: { [Op.in]: vipUsersList }
      },
      raw: true
    })

    return {
      currentScBalance: +result?.currentScBalance || 0,
      vaultScBalance: +result?.vaultScBalance || 0
    }
  }

  async getWhalePlayerSums (startDate, endDate, managedBy, vipUsersList = []) {
    const { sequelize } = this.context
    let conditions = 'WHERE timestamp BETWEEN :startDate AND :endDate'
    if (Array.isArray(vipUsersList)) {
      if (vipUsersList.length > 0) {
        conditions += ' AND user_id IN (:vipUsersList)'
      } else {
        // No VIP users → force empty result set safely
        conditions += ' AND 1=0'
      }
    }

    if (Array.isArray(managedBy)) {
      conditions += ' AND managed_by IN (:managedBy)'
    } else if (managedBy) {
      conditions += ' AND managed_by = :managedBy'
    }

    const [result] = await sequelize.query(
    `
    SELECT 
      COALESCE(SUM(total_purchase_amount), 0) AS "totalPurchaseAmount",
      COALESCE(SUM(total_redemption_amount), 0) AS "totalRedemptionAmount",
      COALESCE(SUM(total_sc_bet_amount), 0) AS "totalScBetAmount",
      COALESCE(SUM(total_sc_win_amount), 0) AS "totalScWinAmount",
      ARRAY_AGG(DISTINCT user_id) AS "userIds"
    FROM public.whale_players
    ${conditions}
    `,
    {
      replacements: { startDate, endDate, managedBy, vipUsersList },
      type: sequelize.QueryTypes.SELECT
    }
    )
    return {
      totalPurchaseAmount: Number(result?.totalPurchaseAmount || 0),
      totalRedemptionAmount: Number(result?.totalRedemptionAmount || 0),
      totalScBetAmount: Number(result?.totalScBetAmount || 0),
      totalScWinAmount: Number(result?.totalScWinAmount || 0),
      userIds: result?.userIds || []
    }
  }
}
