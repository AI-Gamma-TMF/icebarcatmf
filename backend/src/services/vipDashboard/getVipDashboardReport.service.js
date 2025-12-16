import db, { sequelize } from '../../db/models'
import { Op, QueryTypes } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { divide, minus, round, times, plus } from 'number-precision'
import { adjustTimestampByTimezone } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'

export class VipUsersDashBoardReport extends ServiceBase {
  async run () {
    try {
      let { startDate, endDate, playerType = 'vip', timezone = 'PST', reportType } = this.args

      const vipUsers = (await db.UserInternalRating.findAll({ where: { vipStatus: 'approved' }, attributes: ['userId'] })).map(obj => { return obj.userId })

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
      // const today = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)
      const todayEnd = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      // Start of yesterday (00:00:00.000)
      const yesterdayStartDate = new Date()
      yesterdayStartDate.setUTCDate(yesterdayStartDate.getUTCDate() - 1)
      const startOfMonthDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
      const startOfMonth = adjustTimestampByTimezone(new Date(startOfMonthDate.getUTCFullYear(), startOfMonthDate.getUTCMonth(), startOfMonthDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)

      // Last 7 days including today
      const sevenDaysAgoDate = new Date(currentDate)
      sevenDaysAgoDate.setUTCDate(currentDate.getUTCDate() - 6) // Go back 6 days (7 days total including today)

      const last7DaysStart = adjustTimestampByTimezone(new Date(sevenDaysAgoDate.getUTCFullYear(), sevenDaysAgoDate.getUTCMonth(), sevenDaysAgoDate.getUTCDate(), 0, 0, 0, 0).toISOString(), timezone)

      const last7DaysEnd = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999).toISOString(), timezone)

      // Start of This Year
      const startOfThisYear = adjustTimestampByTimezone(new Date(currentDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0).toISOString(), timezone)

      // const currentDate = new Date()

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
      if (reportType === '1') {
        try {
          const [

            totalPurchaseAmountSumForTillDate,

            approvalRedemptionAmountSumForTillDate,

            pendingRedemptionAmountSumForTillDate,

            totalScBetAmountSumTillDate,

            totalScWinAmountSumTillDate,

            totalScVaultAmountSumTillDate,

            totalScCurrentAmountSumTillDate,

            totalApprovedVipTillDate,
            totalPendingVipTillDate

          ] = await Promise.all([

            this.getTotalPurchaseAmountSum(new Date(0), todayEnd, vipUsers, playerType),

            this.getApprovedRedemptionAmountSum(new Date(0), todayEnd, vipUsers, playerType),

            this.getPendingRedemptionAmountSum(new Date(0), todayEnd, vipUsers, playerType),

            this.getScTransactionSum(new Date(0), todayEnd, vipUsers, playerType, 'bet'),

            this.getScTransactionSum(new Date(0), todayEnd, vipUsers, playerType, 'win'),

            this.getVipUsersVaultBalance(new Date(0), todayEnd, vipUsers, playerType, 'vault'),

            this.getVipUsersVaultBalance(new Date(0), todayEnd, vipUsers, playerType, 'current'),

            this.getVipUsersCount(vipUsers, 'approved'),
            this.getVipUsersCount(vipUsers, 'pending')
          ])
          return {
            TOTAL_SC_WIN_AMOUNT_SUM: {
              TILL_DATE: totalScWinAmountSumTillDate
            },
            SC_GGR_TOTAL: {
              TILL_DATE: +round(minus(+totalScBetAmountSumTillDate, +totalScWinAmountSumTillDate), 2)
            },
            APPROVED_VIP_COUNT: {
              TILL_DATE: totalApprovedVipTillDate
            },
            PENDING_VIP_COUNT: {
              TILL_DATE: totalPendingVipTillDate
            },
            SC_NGR_TOTAL: {
              TILL_DATE: +round(+minus(+totalPurchaseAmountSumForTillDate, +plus(+approvalRedemptionAmountSumForTillDate, +pendingRedemptionAmountSumForTillDate, +totalScCurrentAmountSumTillDate, +totalScVaultAmountSumTillDate)), 2)
            }
          }
        } catch (error) {
          // Handle errors
          throw new Error('Error calculating metrics: ' + error.message)
        }
      }
      if (reportType === '2') {
        try {
          const [

            totalPurchaseAmountSumForMonthToDate,
            totalPurchaseAmountSumForLastWeek,
            totalPurchaseAmountSumForYearToDate,

            approvalRedemptionAmountSumForMonthToDate,
            approvalRedemptionAmountSumForLastWeek,
            approvalRedemptionAmountSumForYearToDate,

            totalScBetAmountSumMonthToDate,
            totalScBetAmountSumLastWeek,
            totalScBetAmountSumYearToDate,

            totalScWinAmountSumMonthToDate,
            totalScWinAmountSumLastWeek,
            totalScWinAmountSumYearToDate

          ] = await Promise.all([

            this.getTotalPurchaseAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            this.getTotalPurchaseAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getTotalPurchaseAmountSum(startOfThisYear, todayEnd, vipUsers, playerType),

            this.getApprovedRedemptionAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            this.getApprovedRedemptionAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getApprovedRedemptionAmountSum(startOfThisYear, todayEnd, vipUsers, playerType),

            this.getScTransactionSum(startOfMonth, todayEnd, vipUsers, playerType, 'bet'),
            this.getScTransactionSum(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'bet'),
            this.getScTransactionSum(startOfThisYear, todayEnd, vipUsers, playerType, 'bet'),

            this.getScTransactionSum(startOfMonth, todayEnd, vipUsers, playerType, 'win'),
            this.getScTransactionSum(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'win'),
            this.getScTransactionSum(startOfThisYear, todayEnd, vipUsers, playerType, 'win')

          ])
          return {
            PURCHASE_AMOUNT_SUM: {
              MONTH_TO_DATE: totalPurchaseAmountSumForMonthToDate,
              LAST_WEEK: totalPurchaseAmountSumForLastWeek,
              YEAR_TO_DATE: totalPurchaseAmountSumForYearToDate,
              MONTHLY_AVERAGE: +round(+divide(+totalPurchaseAmountSumForYearToDate, Number(totalMonths.toFixed(2))), 2) || 0
            },
            APPROVAL_REDEMPTION_AMOUNT_SUM: {
              MONTH_TO_DATE: approvalRedemptionAmountSumForMonthToDate,
              LAST_WEEK: approvalRedemptionAmountSumForLastWeek,
              YEAR_TO_DATE: approvalRedemptionAmountSumForYearToDate,
              MONTHLY_AVERAGE: +round(+divide(+approvalRedemptionAmountSumForYearToDate, Number(totalMonths.toFixed(2))), 2) || 0
            },
            TOTAL_SC_BET_AMOUNT_SUM: {
              MONTH_TO_DATE: totalScBetAmountSumMonthToDate,
              LAST_WEEK: totalScBetAmountSumLastWeek,
              YEAR_TO_DATE: totalScBetAmountSumYearToDate,
              MONTHLY_AVERAGE: +round(+divide(+totalScBetAmountSumYearToDate, Number(totalMonths.toFixed(2))), 2) || 0
            },
            SC_GGR_TOTAL: {
              MONTH_TO_DATE: +round(minus(+totalScBetAmountSumMonthToDate, +totalScWinAmountSumMonthToDate), 2),
              LAST_WEEK: +round(minus(+totalScBetAmountSumLastWeek, +totalScWinAmountSumLastWeek), 2),
              YEAR_TO_DATE: +round(minus(+totalScBetAmountSumYearToDate, +totalScWinAmountSumYearToDate), 2),
              MONTHLY_AVERAGE: +round(+divide(+round(minus(+totalScBetAmountSumYearToDate, +totalScWinAmountSumYearToDate), 2), Number(totalMonths.toFixed(2))), 2) || 0
            }
          }
        } catch (error) {
          // Handle errors
          throw new Error('Error calculating metrics: ' + error.message)
        }
      }

      if (reportType === '3') {
        try {
          const [

            totalPurchaseAmountSumForMonthToDate,
            totalPurchaseAmountSumForLastWeek,
            totalPurchaseAmountSumForYearToDate,

            approvalRedemptionAmountSumForMonthToDate,
            approvalRedemptionAmountSumForLastWeek,
            approvalRedemptionAmountSumForYearToDate,

            pendingRedemptionAmountSumForMonthToDate,
            pendingRedemptionAmountSumForLastWeek,
            pendingRedemptionAmountSumForYearToDate,

            totalScBetAmountSumMonthToDate,
            totalScBetAmountSumLastWeek,
            totalScBetAmountSumYearToDate,

            totalScWinAmountSumMonthToDate,
            totalScWinAmountSumLastWeek,
            totalScWinAmountSumYearToDate,

            totalScVaultAmountSumMonthToDate,
            totalScVaultAmountSumLastWeek,
            totalScVaultAmountSumYearToDate,

            totalScCurrentAmountSumMonthToDate,
            totalScCurrentAmountSumLastWeek,
            totalScCurrentAmountSumYearToDate,

            totalReinvestmentSumForMonthToDate,
            totalReinvestmentSumForLastWeek,
            totalReinvestmentForYearToDate

          ] = await Promise.all([

            this.getTotalPurchaseAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            this.getTotalPurchaseAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getTotalPurchaseAmountSum(startOfThisYear, todayEnd, vipUsers, playerType),

            this.getApprovedRedemptionAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            this.getApprovedRedemptionAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getApprovedRedemptionAmountSum(startOfThisYear, todayEnd, vipUsers, playerType),

            this.getPendingRedemptionAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            this.getPendingRedemptionAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getPendingRedemptionAmountSum(startOfThisYear, todayEnd, vipUsers, playerType),

            this.getScTransactionSum(startOfMonth, todayEnd, vipUsers, playerType, 'bet'),
            this.getScTransactionSum(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'bet'),
            this.getScTransactionSum(startOfThisYear, todayEnd, vipUsers, playerType, 'bet'),

            this.getScTransactionSum(startOfMonth, todayEnd, vipUsers, playerType, 'win'),
            this.getScTransactionSum(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'win'),
            this.getScTransactionSum(startOfThisYear, todayEnd, vipUsers, playerType, 'win'),

            this.getVipUsersVaultBalance(startOfMonth, todayEnd, vipUsers, playerType, 'vault'),
            this.getVipUsersVaultBalance(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'vault'),
            this.getVipUsersVaultBalance(startOfThisYear, todayEnd, vipUsers, playerType, 'vault'),

            this.getVipUsersVaultBalance(startOfMonth, todayEnd, vipUsers, playerType, 'current'),
            this.getVipUsersVaultBalance(last7DaysStart, last7DaysEnd, vipUsers, playerType, 'current'),
            this.getVipUsersVaultBalance(startOfThisYear, todayEnd, vipUsers, playerType, 'current'),

            this.getReinvestmentData(startOfMonth, todayEnd, vipUsers, playerType),
            this.getReinvestmentData(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            this.getReinvestmentData(startOfThisYear, todayEnd, vipUsers, playerType)
          ])
          return {
            HOLD_PERCENTAGE: {
              MONTH_TO_DATE: +round(times(+divide(+totalScBetAmountSumMonthToDate, +totalScWinAmountSumMonthToDate), 100), 2) || 0,
              LAST_WEEK: +round(times(+divide(+totalScBetAmountSumLastWeek, +totalScWinAmountSumLastWeek), 100), 2) || 0,
              YEAR_TO_DATE: +round(times(+divide(+totalScBetAmountSumYearToDate, +totalScWinAmountSumYearToDate), 100), 2) || 0,
              MONTHLY_AVERAGE: +round(+divide(+round(times(+divide(+totalScBetAmountSumYearToDate, +totalScWinAmountSumYearToDate), 100), 2), Number(totalMonths.toFixed(2))), 2) || 0
            },
            REDEMPTION_TO_PURCHASE_RATIO: {
              MONTH_TO_DATE: +round(times(+divide(approvalRedemptionAmountSumForMonthToDate, totalPurchaseAmountSumForMonthToDate), 100), 2) || 0,
              LAST_WEEK: +round(times(+divide(approvalRedemptionAmountSumForLastWeek, totalPurchaseAmountSumForLastWeek), 100), 2) || 0,
              YEAR_TO_DATE: +round(times(+divide(approvalRedemptionAmountSumForYearToDate, totalPurchaseAmountSumForYearToDate), 100), 2) || 0,
              MONTHLY_AVERAGE: +round(+divide(+round(times(+divide(approvalRedemptionAmountSumForYearToDate, totalPurchaseAmountSumForYearToDate), 100), 2), Number(totalMonths.toFixed(2))), 2) || 0
            },
            REINVESTMENT_PERCENTAGE: {
              MONTH_TO_DATE: totalReinvestmentSumForMonthToDate,
              LAST_WEEK: totalReinvestmentSumForLastWeek,
              YEAR_TO_DATE: totalReinvestmentForYearToDate,
              MONTHLY_AVERAGE: +round(+divide(+totalReinvestmentForYearToDate, Number(totalMonths.toFixed(2))), 2) || 0
            },
            SC_NGR_TOTAL: {
              MONTH_TO_DATE: +round(+minus(+totalPurchaseAmountSumForMonthToDate, +plus(+approvalRedemptionAmountSumForMonthToDate, +pendingRedemptionAmountSumForMonthToDate, +totalScCurrentAmountSumMonthToDate, +totalScVaultAmountSumMonthToDate)), 2),
              LAST_WEEK: +round(+minus(+totalPurchaseAmountSumForLastWeek, +plus(+approvalRedemptionAmountSumForLastWeek, +pendingRedemptionAmountSumForLastWeek, +totalScCurrentAmountSumLastWeek, +totalScVaultAmountSumLastWeek)), 2),
              YEAR_TO_DATE: +round(+minus(+totalPurchaseAmountSumForYearToDate, +plus(+approvalRedemptionAmountSumForYearToDate, +pendingRedemptionAmountSumForYearToDate, +totalScCurrentAmountSumYearToDate, +totalScVaultAmountSumYearToDate)), 2),
              MONTHLY_AVERAGE: +round(
                +minus(
                  +round(+divide(+totalPurchaseAmountSumForYearToDate, Number(totalMonths.toFixed(2))), 2),
                  +plus(
                    +round(+divide(+approvalRedemptionAmountSumForYearToDate, Number(totalMonths.toFixed(2))), 2),
                    +round(+divide(+pendingRedemptionAmountSumForYearToDate, Number(totalMonths.toFixed(2))), 2),
                    +round(+divide(+totalScCurrentAmountSumYearToDate, Number(totalMonths.toFixed(2))), 2),
                    +round(+divide(+totalScVaultAmountSumYearToDate, Number(totalMonths.toFixed(2))), 2)
                  )
                ),
                2) || 0

            }
          }
        } catch (error) {
          // Handle errors
          throw new Error('Error calculating metrics: ' + error.message)
        }
      }
    } catch (error) {
      console.log(error, 'error')
      throw new Error('Error calculating metrics: ' + error.message)
    }
  }

  async getTotalPurchaseAmountSum (startDate, endDate, vipUsers, playerType) {
    let query = ''
    if (playerType === 'vip') query = { actioneeId: { [Op.in]: vipUsers } }
    else if (playerType === 'normal') query = { actioneeId: { [Op.notIn]: vipUsers } }
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

  async getApprovedRedemptionAmountSum (startDate, endDate, vipUsers, playerType) {
    let query = ''
    if (playerType === 'vip') query = { actioneeId: { [Op.in]: vipUsers } }
    else if (playerType === 'normal') query = { actioneeId: { [Op.notIn]: vipUsers } }
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

  async getScTransactionSum (startDate, endDate, vipUsers, playerType, actionType) {
    let query = ''
    if (playerType === 'vip') query = { userId: { [Op.in]: vipUsers } }
    else if (playerType === 'normal') query = { userId: { [Op.notIn]: vipUsers } }
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

  async getPendingRedemptionAmountSum (startDate, endDate, vipUsers, playerType) {
    let query = ''
    if (playerType === 'vip') query = { userId: { [Op.in]: vipUsers } }
    else if (playerType === 'normal') query = { userId: { [Op.notIn]: vipUsers } }
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

  async getVipUsersCount (vipUsers, vipType) {
    let query = ''
    if (vipType === 'approved') query = { userId: { [Op.in]: vipUsers }, vipStatus: 'approved' }
    else if (vipType === 'pending') {
      query = {
        userId: { [Op.notIn]: vipUsers },
        vipStatus: 'pending',
        rating: {
          [Op.and]: {
            [Op.gte]: 0,
            [Op.lte]: 3
          }
        }
      }
    }

    const vipUserCount = await db.UserInternalRating.count({
      col: 'user_internal_rating_id',
      where: {
        ...query
      }
    })

    return +vipUserCount || 0
  }

  async getVipUsersVaultBalance (startDate, endDate, vipUsers, vipType, balanceType) {
    let query = ''
    if (vipType === 'vip') query = { ownerId: { [Op.in]: vipUsers } }
    else if (vipType === 'normal') query = { ownerId: { [Op.notIn]: vipUsers } }

    let balanceQuery = ''
    if (balanceType === 'vault') {
      balanceQuery = "TRUNC(SUM((vault_sc_coin->>'bsc')::numeric + (vault_sc_coin->>'psc')::numeric + (vault_sc_coin->>'wsc')::numeric), 2)"
    } else if (balanceType === 'current') {
      balanceQuery = "TRUNC(SUM((sc_coin->>'bsc')::numeric + (sc_coin->>'psc')::numeric + (sc_coin->>'wsc')::numeric), 2)"
    } else {
      throw new Error("Invalid balanceType. Use 'vault' or 'current'.")
    }

    const result = await db.Wallet.findOne({
      where: {
        ...query
        // createdAt: {
        //   [Op.and]: {
        //     [Op.gte]: startDate,
        //     [Op.lte]: endDate
        //   }
        // }
      },
      attributes: [[sequelize.literal(balanceQuery), 'totalBalance']],
      raw: true
    })

    return parseFloat(result?.totalBalance) || 0
  }

  async getReinvestmentData (startDate, endDate, vipUsers, vipType) {
    let whereCondition = '1=1'
    if (vipType === 'vip' && vipUsers.length) {
      whereCondition = 'tb.actionee_id IN (:vipUsers)'
    } else if (vipType === 'normal' && vipUsers.length) {
      whereCondition = 'tb.actionee_id NOT IN (:vipUsers)'
    }
    const query = `
      WITH filtered_users AS (
        SELECT
          tb.actionee_id,
          u.email,
          tb.created_at
        FROM public.transaction_bankings tb
        LEFT JOIN public.users u ON u.user_id = tb.actionee_id
        WHERE tb.created_at BETWEEN :startDate AND :endDate
          AND ${whereCondition}
      ),
      admin_bonus AS (
        SELECT
          actionee_id,
          SUM(CASE WHEN transaction_type = 'addSc' THEN amount ELSE 0 END) -
          SUM(CASE WHEN transaction_type = 'removeSc' THEN amount ELSE 0 END) AS admin_bonus
        FROM public.transaction_bankings
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY actionee_id
      ),
      site_bonus AS (
        SELECT
          ub.user_id,
          SUM(b.sc_amount) AS site_bonus
        FROM public.user_bonus ub
        JOIN public.bonus b ON b.bonus_id = ub.bonus_id
        WHERE ub.created_at BETWEEN :startDate AND :endDate
        GROUP BY ub.user_id
      ),
      site_bonus_deposit AS (
        SELECT
          actionee_id,
          SUM(bonus_sc) AS site_bonus_deposit
        FROM public.transaction_bankings
        WHERE transaction_type = 'deposit'
          AND is_success = true
          AND created_at BETWEEN :startDate AND :endDate
        GROUP BY actionee_id
      ),
      user_loss AS (
        SELECT
          user_id,
          SUM(CASE WHEN action_type = 'bet' THEN amount ELSE 0 END) -
          SUM(CASE WHEN action_type = 'win' THEN amount ELSE 0 END) AS total_loss
        FROM public.casino_transactions
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY user_id
      ),
      combined AS (
        SELECT
          f.actionee_id AS "userId",
          f.email AS "userEmail",
          MIN(f.created_at) AS "startDate",
          MAX(f.created_at) AS "endDate",
          COALESCE(ab.admin_bonus, 0) AS "adminBonusGiven",
          COALESCE(sb.site_bonus, 0) AS "siteBonusGiven",
          COALESCE(sbd.site_bonus_deposit, 0) AS "siteBonusDeposit",
          COALESCE(ul.total_loss, 0) AS "totalLoss"
        FROM filtered_users f
        LEFT JOIN admin_bonus ab ON ab.actionee_id = f.actionee_id
        LEFT JOIN site_bonus sb ON sb.user_id = f.actionee_id
        LEFT JOIN site_bonus_deposit sbd ON sbd.actionee_id = f.actionee_id
        LEFT JOIN user_loss ul ON ul.user_id = f.actionee_id
        GROUP BY f.actionee_id, f.email, ab.admin_bonus, sb.site_bonus, sbd.site_bonus_deposit, ul.total_loss
      ),
      totals AS (
        SELECT
          SUM("adminBonusGiven" + "siteBonusGiven" + "siteBonusDeposit") AS total_bonuses,
          SUM("totalLoss") AS total_loss
        FROM combined
      )
      SELECT
        total_bonuses,
        total_loss,
        CASE 
          WHEN total_loss = 0 THEN 0
          ELSE ROUND(((total_bonuses / total_loss) * 100)::numeric, 2)
        END AS total_bonus_to_loss_ratio
      FROM totals;
    `

    const replacements = { startDate, endDate }
    if (vipUsers.length) {
      replacements.vipUsers = vipUsers
    }

    const [result] = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    })

    return result.total_bonus_to_loss_ratio
  }
}
