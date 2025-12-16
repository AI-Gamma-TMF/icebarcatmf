import ajv from '../../libs/ajv'
import { Op, QueryTypes } from 'sequelize'
import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { divide, minus, round, times, plus } from 'number-precision'
import { calculateUTCDateRangeForTimezoneRange } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'

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
export class GetVipUserReportService extends ServiceBase {
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
        totalPurchaseAmountSum,
        approvedRedemptionAmountSum,
        pendingRedemptionAmountSum,
        totalScBetAmountSum,
        totalScWinAmountSum,
        userVaultBalance,
        reinvestmentData
      ] =
     await Promise.all([
       this.getTotalPurchaseAmountSum(startDate, endDate, userId),
       this.getApprovedRedemptionAmountSum(startDate, endDate, userId),
       this.getPendingRedemptionAmountSum(startDate, endDate, userId),
       this.getTotalScBetAmountSum(startDate, endDate, userId),
       this.getTotalScWinAmountSum(startDate, endDate, userId),
       this.getUsersVaultBalance(startDate, endDate, userId),
       this.getReinvestmentData(startDate, endDate, userId)
     ])

      const finalReport = {
        totalPurchaseAmountSum,
        approvedRedemptionAmountSum,
        pendingRedemptionAmountSum,
        totalScBetAmountSum,
        totalScWinAmountSum,
        totalGgr: +round(minus(+totalScBetAmountSum, +totalScWinAmountSum), 2),
        redemptionToPurchaseRatio: +round(times(+divide(approvedRedemptionAmountSum, totalPurchaseAmountSum), 100), 2) || 0, // (Redemption Amount / Total Purchase Amount) × 100  ,
        holdPercentage: +round(times(+divide(+totalScBetAmountSum, +totalScWinAmountSum), 100), 2) || 0, // The hold percentage is calculated as the ratio of total bets to total wins
        reinvestmentPercentage: reinvestmentData, //  formula is : [Total Bonus Given (Admin Bonus + Site Bonus) / Total Loss] × 100
        currentScBalance: userVaultBalance?.currentScBalance || 0,
        vaultScBalance: userVaultBalance?.vaultScBalance || 0,
        ngr: +round(+minus(+totalPurchaseAmountSum, +plus(+approvedRedemptionAmountSum, +pendingRedemptionAmountSum, +(userVaultBalance?.currentScBalance ?? 0), +(userVaultBalance?.vaultScBalance ?? 0))), 2)
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

  async getTotalPurchaseAmountSum (startDate, endDate, userId) {
    const { dbModels: { TransactionBanking: TransactionBankingModel } } = this.context
    const whereClause = {
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      isSuccess: true,
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      actioneeId: userId
    }

    const totalPurchaseAmountSum = await TransactionBankingModel.sum('amount',
      {
        where: whereClause
      })

    return +totalPurchaseAmountSum?.toFixed(2) || 0
  }

  async getApprovedRedemptionAmountSum (startDate, endDate, userId) {
    const { dbModels: { TransactionBanking: TransactionBankingModel } } = this.context
    const approvalRedemptionAmountSum = await TransactionBankingModel.findAll(
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
          status: TRANSACTION_STATUS.SUCCESS,
          transactionType: TRANSACTION_TYPE.WITHDRAW,
          actioneeId: userId
        }
      })
    return +approvalRedemptionAmountSum[0].dataValues.amount || 0
  }

  async getPendingRedemptionAmountSum (startDate, endDate, userId) {
    const { dbModels: { WithdrawRequest: WithdrawRequestModel } } = this.context
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

  async getTotalScBetAmountSum (startDate, endDate, userId) {
    const { dbModels: { CasinoTransaction: CasinoTransactionModel } } = this.context
    const scStakedAmountSum = await CasinoTransactionModel.findAll(
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
          actionType: 'bet',
          amountType: 1,
          userId
        }
      })

    return +scStakedAmountSum[0].dataValues.amount || 0
  }

  async getTotalScWinAmountSum (startDate, endDate, userId) {
    const { dbModels: { CasinoTransaction: CasinoTransactionModel } } = this.context
    const scStakedAmountSum = await CasinoTransactionModel.findAll(
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
          actionType: 'win',
          amountType: 1,
          userId
        }
      })

    return +scStakedAmountSum[0].dataValues.amount || 0
  }

  async getUsersVaultBalance (startDate, endDate, userId) {
    const { dbModels: { Wallet: WalletModel } } = this.context

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

  async getReinvestmentData (startDate, endDate, userId) {
    const query = `
      WITH filtered_user AS (
        SELECT
          tb.actionee_id,
          u.email,
          tb.created_at
        FROM public.transaction_bankings tb
        LEFT JOIN public.users u ON u.user_id = tb.actionee_id
        WHERE tb.created_at BETWEEN :startDate AND :endDate
          AND tb.actionee_id = :userId
      ),
      admin_bonus AS (
        SELECT
          actionee_id,
          SUM(CASE WHEN transaction_type = 'addSc' THEN amount ELSE 0 END) -
          SUM(CASE WHEN transaction_type = 'removeSc' THEN amount ELSE 0 END) AS admin_bonus
        FROM public.transaction_bankings
        WHERE created_at BETWEEN :startDate AND :endDate
          AND actionee_id = :userId
        GROUP BY actionee_id
      ),
     site_bonus AS (
  SELECT
    ub.user_id,
    SUM(b.sc_amount) AS site_bonus
  FROM public.user_bonus ub
  JOIN public.bonus b ON b.bonus_id = ub.bonus_id
  WHERE ub.created_at BETWEEN :startDate AND :endDate
    AND ub.user_id = :userId
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
          AND actionee_id = :userId
        GROUP BY actionee_id
      ),
      user_loss AS (
        SELECT
          user_id,
          SUM(CASE WHEN action_type = 'bet' THEN amount ELSE 0 END) -
          SUM(CASE WHEN action_type = 'win' THEN amount ELSE 0 END) AS total_loss
        FROM public.casino_transactions
        WHERE created_at BETWEEN :startDate AND :endDate
          AND user_id = :userId
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
        FROM filtered_user f
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

    const replacements = { startDate, endDate, userId }

    const [result] = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    })
    return result.total_bonus_to_loss_ratio
  }
}
