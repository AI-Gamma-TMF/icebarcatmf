import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE, TRANSACTION_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import { Op, Sequelize } from 'sequelize'
import { getDates } from '../../utils/elastic'

const schema = {
  type: 'object',
  properties: {
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    dateOptions: {
      type: ['string'],
      enum: [
        'today',
        'yesterday',
        'monthtodate',
        'previousyear',
        'custom',
        'last7days',
        'last30days',
        'previousmonth',
        'last90days',
        'yeartodate',
        'weektodate'
      ]
    }
  }
}
const constraints = ajv.compile(schema)

export class DashboardUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let { startDate, endDate, dateOptions } = this.args

      if (!dateOptions) {
        dateOptions = 'today'
      }
      const users = {
        activeLogin: 0,
        active: 0,
        inactive: 0,
        totalPlayerBalance: { gc_coin: 0, sc_coin: 0 },
        bonus: { gc_coin: 0, sc_coin: 0 },
        netProfit: 0,
        registrations: 0,
        TotalWithdrawals: { amount: 0 },
        TotalDeposits: { amount: 0 },
        depositConvRate: 0,
        registrationConvRate: 0
      }
      if (dateOptions === 'custom') {
        if (!startDate || !endDate) return this.addError('CustomDateErrorType')
      }
      const filterDates = getDates({ dateOptions, customStartDate: startDate, customEndDate: endDate })
      const whereObject = {
        createdAt: {
          [Op.and]: {
            [Op.gte]: filterDates.startDate,
            [Op.lte]: filterDates.endDate
          }
        }
      }
      const whereObjectUser = {
        updatedAt: {
          [Op.and]: {
            [Op.gte]: filterDates.startDate,
            [Op.lte]: filterDates.endDate
          }
        }
      }
      users.registrations = await db.User.count({
        where: whereObject
      })
      users.inactive = await db.User.count({
        where: {
          ...whereObjectUser,
          [Op.or]: { isActive: false, signInCount: { [Op.eq]: 0 } }
        }
      })
      users.active = await db.User.count({
        where: { isActive: true, [Op.and]: { signInCount: { [Op.gt]: 0 } }, ...whereObjectUser }
      })
      users.activeLogin = await db.User.count({
        where: { isActive: true, [Op.and]: { loggedIn: { [Op.gt]: 0 } }, ...whereObjectUser }
      })
      const totalPlayerBalance = await db.Wallet.findOne({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('gc_coin')), 'gc_coin']
        ],
        where: { ownerType: 'user' },
        raw: true
      })

      const totalPlayerScCoins = await db.Wallet.findAll({ attributes: ['scCoin'] })

      if (totalPlayerBalance) users.totalPlayerBalance.gc_coin = totalPlayerBalance.gc_coin || 0
      if (totalPlayerScCoins) {
        let totalCoins = 0
        for (const player of totalPlayerScCoins) {
          const coins = player.scCoin
          Object.values(coins).forEach((coin) => { totalCoins += coin })
        }

        users.totalPlayerBalance.sc_coin = (Math.round(totalCoins * 100) / 100).toFixed(2)
      }

      const totalWinAmount = await db.CasinoTransaction.sum('amount', { where: { actionType: 'win', ...whereObject } })
      const totalBetAmount = await db.CasinoTransaction.sum('amount', { where: { actionType: 'bet', ...whereObject } })
      users.netProfit = (totalBetAmount - totalWinAmount).toFixed(2)

      const totalDeposits = await db.TransactionBanking.findOne({
        where: { actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.DEPOSIT, status: TRANSACTION_STATUS.SUCCESS, ...whereObject },
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']
        ],
        raw: true
      })
      const totalDepositsCount = await db.TransactionBanking.count({
        where: { actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.DEPOSIT, status: TRANSACTION_STATUS.SUCCESS, ...whereObject },
        raw: true
      })
      if (totalDeposits?.amount) {
        users.TotalDeposits = totalDeposits
      }
      const totalWithdrawals = await db.TransactionBanking.findOne({
        where: { actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.WITHDRAW, status: TRANSACTION_STATUS.SUCCESS, ...whereObject },
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']
        ],
        raw: true
      })
      if (totalWithdrawals?.amount) {
        users.TotalWithdrawals = totalWithdrawals
      }
      if (users.active) {
        users.registrationConvRate = Math.abs((users.active / users.registrations) * 100).toFixed(2)
      }
      if (users.registrations !== 0) {
        users.depositConvRate = Math.abs((totalDepositsCount / users.registrations) * 100).toFixed(2)
      }
      const totalBonus = await db.TransactionBanking.findOne({
        where: { actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.BONUS, status: TRANSACTION_STATUS.SUCCESS, ...whereObject },
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('gc_coin')), 'gc_coin'],
          [Sequelize.fn('sum', Sequelize.col('sc_coin')), 'sc_coin']
        ],
        raw: true
      })
      if (totalBonus) {
        users.bonus.gc_coin = totalBonus.gc_coin || 0
        users.bonus.sc_coin = totalBonus.sc_coin || 0
      }
      return { users, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
