import ajv from '../../libs/ajv'
import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { divide, minus, round, times, plus } from 'number-precision'
import { calculateUTCDateRangeForTimezoneRange } from '../../utils/common'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: ['string'] },
    timezone: { type: ['string'] }
  },
  required: ['userId', 'startDate', 'endDate', 'timezone']
}

const constraints = ajv.compile(schema)
export class GetVipUserOptimizedReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let { startDate, endDate, userId, timezone } = this.args

      if (startDate || endDate) {
        const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
        startDate = result?.startDateUTC
        endDate = result?.endDateUTC
      }

      const [
        // pendingRedemptionAmountSum,
        userVaultBalance,
        reinvestmentData,
        whalePlayerData
      ] =
     await Promise.all([
       //  this.getPendingRedemptionAmountSum(startDate, endDate, userId),
       this.getUsersVaultBalance(startDate, endDate, userId),
       this.getReinvestmentPercentage(startDate, endDate, userId),
       this.getWhalePlayerSums(startDate, endDate, userId)

     ])

      const finalReport = {
        totalPurchaseAmountSum: whalePlayerData.totalPurchaseAmount,
        approvedRedemptionAmountSum: whalePlayerData.totalRedemptionAmount,
        totalScBetAmountSum: whalePlayerData.totalScBetAmount,
        totalGgr: +round(minus(+whalePlayerData.totalScBetAmount, +whalePlayerData.totalScWinAmount), 2),
        redemptionToPurchaseRatio: +round(times(+divide(+whalePlayerData.totalRedemptionAmount, whalePlayerData.totalPurchaseAmount), 100), 2) || 0, // (Redemption Amount / Total Purchase Amount) × 100  ,
        holdPercentage: +round(times(+divide(+whalePlayerData.totalScBetAmount, +whalePlayerData.totalScWinAmount), 100), 2) || 0, // The hold percentage is calculated as the ratio of total bets to total wins
        reinvestmentPercentage: +round(reinvestmentData, 2), //  formula is : [Total Bonus Given (Admin Bonus + Site Bonus) / Total Loss] × 100
        ngr: +round(+minus(+whalePlayerData.totalPurchaseAmount, +plus(+whalePlayerData.totalRedemptionAmount, +(userVaultBalance?.currentScBalance ?? 0), +(userVaultBalance?.vaultScBalance ?? 0))), 2)
      }
      return {
        data: finalReport,
        status: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  async getPendingRedemptionAmountSum (startDate, endDate, userId) {
    const { dbModels: { WithdrawRequest: WithdrawRequestModel }, sequelize } = this.context
    const requestRedemptionAmountSum = await WithdrawRequestModel.findAll(
      {
        attributes: [
          [sequelize.literal('TRUNC(SUM(amount)::numeric, 2)'), 'amount']
        ],
        where: {
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          },
          status: { [Op.in]: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS] },
          userId
        }
      })
    return +requestRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getUsersVaultBalance (startDate, endDate, userId) {
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
        ownerId: userId
      },
      raw: true
    })

    return {
      currentScBalance: result?.currentScBalance || 0,
      vaultScBalance: result?.vaultScBalance || 0
    }
  }

  async getWhalePlayerSums (startDate, endDate, userId) {
    const { dbModels: { WhalePlayers }, sequelize } = this.context

    const where = {
      timestamp: {
        [Op.between]: [startDate, endDate]
      },
      userId
    }

    const result = await WhalePlayers.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_purchase_amount')), 'totalPurchaseAmount'],
        [sequelize.fn('SUM', sequelize.col('total_redemption_amount')), 'totalRedemptionAmount'],
        [sequelize.fn('SUM', sequelize.col('total_sc_bet_amount')), 'totalScBetAmount'],
        [sequelize.fn('SUM', sequelize.col('total_sc_win_amount')), 'totalScWinAmount']
      ],
      where,
      raw: true
    })

    if (!result) {
      return {
        totalPurchaseAmount: 0,
        totalRedemptionAmount: 0,
        totalScBetAmount: 0,
        totalScWinAmount: 0
      }
    }

    return {
      totalPurchaseAmount: Number(result.totalPurchaseAmount || 0),
      totalRedemptionAmount: Number(result.totalRedemptionAmount || 0),
      totalScBetAmount: Number(result.totalScBetAmount || 0),
      totalScWinAmount: Number(result.totalScWinAmount || 0)
    }
  }

  async getReinvestmentPercentage (startDate, endDate, userId) {
    const { dbModels: { WhalePlayers }, sequelize } = this.context

    const where = {
      timestamp: {
        [Op.between]: [startDate, endDate]
      },
      userId
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
}
