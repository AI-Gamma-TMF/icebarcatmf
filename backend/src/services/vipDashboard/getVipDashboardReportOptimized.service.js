import db, { Sequelize, sequelize } from '../../db/models'
import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { divide, minus, round, times, plus } from 'number-precision'
import { adjustTimestampByTimezone } from '../../utils/common'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

// GET /api/v1/vip/dashboard-report-optimized
export class VipUsersDashBoardReportOptimized extends ServiceBase {
  async run () {
    try {
      let { startDate, endDate, timezone = 'PST', reportType } = this.args

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

      const {
        dbModels: { WhalePlayers: WhalePlayersModel }
      } = this.context

      // const playerType = 'vip'

      if (reportType === '1') {
        const approvedVipCount = vipUsers.length

        const [
          pendingVipCount,

          whaleData,

          totalScCurrentAmountSumTillDate,

          totalScVaultAmountSumTillDate

          // totalPendingRedemptionAmountSum
        ] = await Promise.all([
          this.getVipUsersCount(vipUsers, 'pending'),

          WhalePlayersModel.findAll({
            where: {
              userId: { [Op.in]: vipUsers }
            },
            attributes: [
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN total_sc_win_amount > 0 THEN total_sc_win_amount ELSE 0 END')), 'totalScWinAmountSum'],
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN total_sc_bet_amount > 0 THEN total_sc_bet_amount ELSE 0 END')), 'totalScBetAmountSum'],
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN total_purchase_amount > 0 THEN total_purchase_amount ELSE 0 END')), 'totalPurchaseAmountSum'],
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN total_redemption_amount > 0 THEN total_redemption_amount ELSE 0 END')), 'approvalRedemptionAmountSum'],
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN vip_questionnaire_bonus_amount > 0 THEN vip_questionnaire_bonus_amount ELSE 0 END')), 'vipQuestionnaireBonusAmount'],
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN vip_questionnaire_bonus_count > 0 THEN vip_questionnaire_bonus_count ELSE 0 END')), 'vipQuestionnaireBonusCount']
            ],
            raw: true
          }),

          this.getVipUsersVaultBalance(new Date(0), todayEnd, vipUsers, 'vip', 'current'),
          this.getVipUsersVaultBalance(new Date(0), todayEnd, vipUsers, 'vip', 'vault')

          // this.getPendingRedemptionAmountSum(new Date('2024-01-01'), todayEnd, vipUsers, playerType)
        ])

        const {
          totalScWinAmountSum = 0,
          totalScBetAmountSum = 0,
          totalPurchaseAmountSum = 0,
          approvalRedemptionAmountSum = 0,
          vipQuestionnaireBonusAmount = 0,
          vipQuestionnaireBonusCount = 0
        } = whaleData?.[0] || {}

        return {
          TOTAL_SC_WIN_AMOUNT_SUM: {
            TILL_DATE: +totalScWinAmountSum
          },
          SC_GGR_TOTAL: {
            TILL_DATE: +round(minus(+totalScBetAmountSum, +totalScWinAmountSum), 2)
          },
          APPROVED_VIP_COUNT: {
            TILL_DATE: approvedVipCount
          },
          PENDING_VIP_COUNT: {
            TILL_DATE: pendingVipCount
          },
          SC_NGR_TOTAL: {
            TILL_DATE: +round(+minus(
              +totalPurchaseAmountSum,
              +plus(
                +approvalRedemptionAmountSum,
                // +totalPendingRedemptionAmountSum,
                +totalScCurrentAmountSumTillDate,
                +totalScVaultAmountSumTillDate
              )
            ), 2)
          },
          VIP_QUESTIONNAIRE_BONUS_COUNT: {
            TILL_DATE: +vipQuestionnaireBonusCount
          },
          VIP_QUESTIONNAIRE_BONUS_AMOUNT: {
            TILL_DATE: +vipQuestionnaireBonusAmount
          }
        }
      }

      if (reportType === '2') {
        try {
          const [monthToDate, lastWeek, yearToDate] = await Promise.all([
            this.getWhalePlayerSums(startOfMonth, todayEnd, vipUsers),
            this.getWhalePlayerSums(last7DaysStart, last7DaysEnd, vipUsers),
            this.getWhalePlayerSums(startOfThisYear, todayEnd, vipUsers)
          ])

          return {
            PURCHASE_AMOUNT_SUM: {
              MONTH_TO_DATE: +monthToDate.totalPurchaseAmount,
              LAST_WEEK: +lastWeek.totalPurchaseAmount,
              YEAR_TO_DATE: +yearToDate.totalPurchaseAmount,
              MONTHLY_AVERAGE: +round(+divide(+yearToDate.totalPurchaseAmount, Number(totalMonths.toFixed(2))), 2) || 0
            },
            APPROVAL_REDEMPTION_AMOUNT_SUM: {
              MONTH_TO_DATE: +monthToDate.totalRedemptionAmount,
              LAST_WEEK: +lastWeek.totalRedemptionAmount,
              YEAR_TO_DATE: +yearToDate.totalRedemptionAmount,
              MONTHLY_AVERAGE: +round(+divide(+yearToDate.totalRedemptionAmount, Number(totalMonths.toFixed(2))), 2) || 0
            },
            TOTAL_SC_BET_AMOUNT_SUM: {
              MONTH_TO_DATE: +monthToDate.totalScBetAmount,
              LAST_WEEK: +lastWeek.totalScBetAmount,
              YEAR_TO_DATE: +yearToDate.totalScBetAmount,
              MONTHLY_AVERAGE: +round(+divide(+yearToDate.totalScBetAmount, Number(totalMonths.toFixed(2))), 2) || 0
            },
            SC_GGR_TOTAL: {
              MONTH_TO_DATE: +round(minus(+monthToDate.totalScBetAmount, +monthToDate.totalScWinAmount), 2),
              LAST_WEEK: +round(minus(+lastWeek.totalScBetAmount, +lastWeek.totalScWinAmount), 2),
              YEAR_TO_DATE: +round(minus(+yearToDate.totalScBetAmount, +yearToDate.totalScWinAmount), 2),
              MONTHLY_AVERAGE: +round(+divide(+round(minus(+yearToDate.totalScBetAmount, +yearToDate.totalScWinAmount), 2), Number(totalMonths.toFixed(2))), 2) || 0
            }
          }
        } catch (error) {
          throw new Error('Error calculating metrics: ' + error.message)
        }
      }

      if (reportType === '3') {
        try {
          const [
            whaleMTD,
            whaleLastWeek,
            whaleYTD,

            totalScVaultAmountSumMonthToDate,
            totalScVaultAmountSumLastWeek,
            totalScVaultAmountSumYearToDate,

            totalScCurrentAmountSumMonthToDate,
            totalScCurrentAmountSumLastWeek,
            totalScCurrentAmountSumYearToDate,

            reinvestmentMTD,
            reinvestmentLastWeek,
            reinvestmentYTD

            // pendingRedemptionAmountSumForMonthToDate,
            // pendingRedemptionAmountSumForLastWeek,
            // pendingRedemptionAmountSumForYearToDate
          ] = await Promise.all([
            this.getWhalePlayerSums(startOfMonth, todayEnd, vipUsers),
            this.getWhalePlayerSums(last7DaysStart, last7DaysEnd, vipUsers),
            this.getWhalePlayerSums(startOfThisYear, todayEnd, vipUsers),

            this.getVipUsersVaultBalance(startOfMonth, todayEnd, vipUsers, 'vip', 'vault'),
            this.getVipUsersVaultBalance(last7DaysStart, last7DaysEnd, vipUsers, 'vip', 'vault'),
            this.getVipUsersVaultBalance(startOfThisYear, todayEnd, vipUsers, 'vip', 'vault'),

            this.getVipUsersVaultBalance(startOfMonth, todayEnd, vipUsers, 'vip', 'current'),
            this.getVipUsersVaultBalance(last7DaysStart, last7DaysEnd, vipUsers, 'vip', 'current'),
            this.getVipUsersVaultBalance(startOfThisYear, todayEnd, vipUsers, 'vip', 'current'),

            this.getReinvestmentPercentage(startOfMonth, todayEnd, vipUsers),
            this.getReinvestmentPercentage(last7DaysStart, last7DaysEnd, vipUsers),
            this.getReinvestmentPercentage(startOfThisYear, todayEnd, vipUsers)

            // this.getPendingRedemptionAmountSum(startOfMonth, todayEnd, vipUsers, playerType),
            // this.getPendingRedemptionAmountSum(last7DaysStart, last7DaysEnd, vipUsers, playerType),
            // this.getPendingRedemptionAmountSum(startOfThisYear, todayEnd, vipUsers, playerType)
          ])

          const {
            totalPurchaseAmount: purchaseMTD = 0,
            totalRedemptionAmount: redemptionMTD = 0,
            totalScBetAmount: betMTD = 0,
            totalScWinAmount: winMTD = 0
          } = whaleMTD || {}

          const {
            totalPurchaseAmount: purchaseLastWeek = 0,
            totalRedemptionAmount: redemptionLastWeek = 0,
            totalScBetAmount: betLastWeek = 0,
            totalScWinAmount: winLastWeek = 0
          } = whaleLastWeek || {}

          const {
            totalPurchaseAmount: purchaseYTD = 0,
            totalRedemptionAmount: redemptionYTD = 0,
            totalScBetAmount: betYTD = 0,
            totalScWinAmount: winYTD = 0
          } = whaleYTD || {}

          return {
            HOLD_PERCENTAGE: {
              MONTH_TO_DATE: winMTD ? +round(times(+divide(betMTD, winMTD), 100), 2) : 0,
              LAST_WEEK: winLastWeek ? +round(times(+divide(betLastWeek, winLastWeek), 100), 2) : 0,
              YEAR_TO_DATE: winYTD ? +round(times(+divide(betYTD, winYTD), 100), 2) : 0,
              MONTHLY_AVERAGE: winYTD ? +round(+divide(+round(times(+divide(betYTD, winYTD), 100), 2), Number(totalMonths.toFixed(2))), 2) : 0
            },
            REDEMPTION_TO_PURCHASE_RATIO: {
              MONTH_TO_DATE: purchaseMTD ? +round(times(+divide(redemptionMTD, purchaseMTD), 100), 2) : 0,
              LAST_WEEK: purchaseLastWeek ? +round(times(+divide(redemptionLastWeek, purchaseLastWeek), 100), 2) : 0,
              YEAR_TO_DATE: purchaseYTD ? +round(times(+divide(redemptionYTD, purchaseYTD), 100), 2) : 0,
              MONTHLY_AVERAGE: purchaseYTD ? +round(+divide(+round(times(+divide(redemptionYTD, purchaseYTD), 100), 2), Number(totalMonths.toFixed(2))), 2) : 0
            },
            REINVESTMENT_PERCENTAGE: {
              MONTH_TO_DATE: reinvestmentMTD,
              LAST_WEEK: reinvestmentLastWeek,
              YEAR_TO_DATE: reinvestmentYTD,
              MONTHLY_AVERAGE: +round(+divide(reinvestmentYTD, Number(totalMonths.toFixed(2))), 2) || 0
            },
            SC_NGR_TOTAL: {
              MONTH_TO_DATE: +round(+minus(purchaseMTD, +plus(redemptionMTD, totalScCurrentAmountSumMonthToDate, totalScVaultAmountSumMonthToDate)), 2),
              LAST_WEEK: +round(+minus(purchaseLastWeek, +plus(redemptionLastWeek, totalScCurrentAmountSumLastWeek, totalScVaultAmountSumLastWeek)), 2),
              YEAR_TO_DATE: +round(+minus(purchaseYTD, +plus(redemptionYTD, totalScCurrentAmountSumYearToDate, totalScVaultAmountSumYearToDate)), 2),
              MONTHLY_AVERAGE: +round(
                +minus(
                  +round(+divide(purchaseYTD, Number(totalMonths.toFixed(2))), 2),
                  +plus(
                    +round(+divide(redemptionYTD, Number(totalMonths.toFixed(2))), 2),
                    +round(+divide(totalScCurrentAmountSumYearToDate, Number(totalMonths.toFixed(2))), 2),
                    +round(+divide(totalScVaultAmountSumYearToDate, Number(totalMonths.toFixed(2))), 2)
                  )
                ),
                2
              ) || 0
            }
          }
        } catch (error) {
          throw new Error('Error calculating metrics from whale_players: ' + error.message)
        }
      }

      if (reportType === '4') {
        try {
          const [monthToDate, lastWeek, yearToDate] = await Promise.all([
            this.getWhalePlayerQuestionnaireBonusSum(startOfMonth, todayEnd, vipUsers),
            this.getWhalePlayerQuestionnaireBonusSum(last7DaysStart, last7DaysEnd, vipUsers),
            this.getWhalePlayerQuestionnaireBonusSum(startOfThisYear, todayEnd, vipUsers)
          ])

          return {
            VIP_QUESTIONNAIRE_BONUS_COUNT: {
              MONTH_TO_DATE: +monthToDate.vipQuestionnaireBonusCount,
              LAST_WEEK: +lastWeek.vipQuestionnaireBonusCount,
              YEAR_TO_DATE: +yearToDate.vipQuestionnaireBonusCount,
              MONTHLY_AVERAGE: +round(+divide(+yearToDate.vipQuestionnaireBonusCount, Number(totalMonths.toFixed(2))), 2) || 0
            },
            VIP_QUESTIONNAIRE_BONUS_AMOUNT: {
              MONTH_TO_DATE: +monthToDate.vipQuestionnaireBonusAmount,
              LAST_WEEK: +lastWeek.vipQuestionnaireBonusAmount,
              YEAR_TO_DATE: +yearToDate.vipQuestionnaireBonusAmount,
              MONTHLY_AVERAGE: +round(+divide(+yearToDate.vipQuestionnaireBonusAmount, Number(totalMonths.toFixed(2))), 2) || 0
            }
          }
        } catch (error) {
          throw new Error('Error calculating metrics: ' + error.message)
        }
      }
    } catch (error) {
      console.error(error, 'error')
      throw new Error('Error calculating metrics: ' + error.message)
    }
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

  async getWhalePlayerSums (startDate, endDate, vipUsers) {
    const {
      dbModels: { WhalePlayers },
      sequelize
    } = this.context

    const where = {
      timestamp: {
        [Op.between]: [startDate, endDate]
      }
    }

    if (vipUsers && vipUsers.length > 0) {
      where.userId = { [Op.in]: vipUsers }
    }

    const result = await WhalePlayers.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_purchase_amount')), 'totalPurchaseAmount'],
        [sequelize.fn('SUM', sequelize.col('total_redemption_amount')), 'totalRedemptionAmount'],
        [sequelize.fn('SUM', sequelize.col('total_sc_bet_amount')), 'totalScBetAmount'],
        [sequelize.fn('SUM', sequelize.col('total_sc_win_amount')), 'totalScWinAmount'],
        [sequelize.fn('SUM', sequelize.col('admin_bonus')), 'totalAdminBonus'],
        [sequelize.fn('SUM', sequelize.col('site_bonus_deposit')), 'totalSiteBonusDeposit'],
        [sequelize.fn('SUM', sequelize.col('site_bonus')), 'totalSiteBonus']
      ],
      where,
      raw: true
    })

    if (!result) {
      return {
        totalPurchaseAmount: 0,
        totalRedemptionAmount: 0,
        totalScBetAmount: 0,
        totalScWinAmount: 0,
        totalAdminBonus: 0,
        totalSiteBonusDeposit: 0,
        totalSiteBonus: 0
      }
    }

    return {
      totalPurchaseAmount: Number(result.totalPurchaseAmount || 0),
      totalRedemptionAmount: Number(result.totalRedemptionAmount || 0),
      totalScBetAmount: Number(result.totalScBetAmount || 0),
      totalScWinAmount: Number(result.totalScWinAmount || 0),
      totalAdminBonus: Number(result.totalAdminBonus || 0),
      totalSiteBonusDeposit: Number(result.totalSiteBonusDeposit || 0),
      totalSiteBonus: Number(result.totalSiteBonus || 0)
    }
  }

  async getReinvestmentPercentage (startDate, endDate, vipUsers) {
    const {
      dbModels: { WhalePlayers },
      sequelize
    } = this.context

    const where = {
      timestamp: {
        [Op.between]: [startDate, endDate]
      }
    }

    if (vipUsers && vipUsers.length > 0) {
      where.userId = { [Op.in]: vipUsers }
    }

    const result = await WhalePlayers.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('admin_bonus')), 'totalAdminBonus'],
        [sequelize.fn('SUM', sequelize.col('site_bonus_deposit')), 'totalSiteBonusDeposit'],
        [sequelize.fn('SUM', sequelize.col('site_bonus')), 'totalSiteBonus'],
        [sequelize.fn('SUM', sequelize.literal('total_sc_bet_amount - total_sc_win_amount')), 'totalLoss']
      ],
      where,
      raw: true
    })

    if (!result) {
      return 0
    }

    const totalBonuses = Number(result.totalAdminBonus || 0) +
                        Number(result.totalSiteBonusDeposit || 0) +
                        Number(result.totalSiteBonus || 0)

    const totalLoss = Number(result.totalLoss || 0)

    if (totalLoss === 0) {
      return 0
    }

    return round(times(divide(totalBonuses, totalLoss), 100), 2)
  }

  async getScTransactionSum (startDate, endDate, vipUsers, playerType = 'vip', actionType) {
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

  async getPendingRedemptionAmountSum (startDate, endDate, vipUsers, playerType = 'vip') {
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

  async getWhalePlayerQuestionnaireBonusSum (startDate, endDate, vipUsers) {
    const {
      dbModels: { WhalePlayers },
      sequelize
    } = this.context

    const where = {
      timestamp: {
        [Op.between]: [startDate, endDate]
      }
    }

    if (vipUsers && vipUsers.length > 0) {
      where.userId = { [Op.in]: vipUsers }
    }

    const result = await WhalePlayers.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('vip_questionnaire_bonus_count')), 'vipQuestionnaireBonusCount'],
        [sequelize.fn('SUM', sequelize.col('vip_questionnaire_bonus_amount')), 'vipQuestionnaireBonusAmount']
      ],
      where,
      raw: true
    })

    if (!result) {
      return {
        vipQuestionnaireBonusCount: 0,
        vipQuestionnaireBonusAmount: 0
      }
    }

    return {
      vipQuestionnaireBonusCount: Number(result.vipQuestionnaireBonusCount || 0),
      vipQuestionnaireBonusAmount: Number(result.vipQuestionnaireBonusAmount || 0)
    }
  }
}
