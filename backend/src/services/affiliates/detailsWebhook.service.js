import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { isDateValid, formatTime } from '../../utils/common'
import { ACTION, AMOUNT_TYPE, BONUS_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'

export class AffiliateDetailWebhookService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        TransactionBanking: TransactionBankingModel,
        CasinoTransaction: CasinoTransactionModel
      }
    } = this.context

    let {
      date_start: startDate,
      date_end: endDate,
      api_key: apiKey,
      type
    } = this.args

    type = type?.split(',')

    if (apiKey !== config.get('scaleo.api_key')) return this.addError('ApiKeyNotCorrectErrorType')

    if (!startDate || !endDate) {
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      startDate.setMonth(startDate.getMonth() - 3)
      endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
    }

    if (!isDateValid(startDate) && !isDateValid(endDate)) return this.addError('InvalidDateErrorType')

    if (new Date(startDate) >= new Date(endDate)) return this.addError('InvalidDateErrorType')

    const users = await UserModel.findAll({
      attributes: ['createdAt', 'affiliateCode', 'userId'],
      where: {
        isActive: true,
        affiliateCode: {
          [Op.ne]: null
        },
        affiliateId: {
          [Op.ne]: null
        },
        isInternalUser: false
      }
    })

    const affiliateUsers = users.map(user => {
      return user.userId
    })

    const [registrationData, transactionData, casinoTransactionData] =
      await Promise.all([
        this.getRegistrationData(users, startDate, endDate, type),
        this.getBankingTransactions(TransactionBankingModel, UserModel, affiliateUsers, startDate, endDate, type),
        this.getCasinoTransaction(CasinoTransactionModel, UserModel, affiliateUsers, startDate, endDate, type)
      ])

    return {
      status: 'success',
      code: 200,
      data: {
        events: [
          ...registrationData,
          ...transactionData,
          ...casinoTransactionData
        ]
      }
    }
  }

  async getRegistrationData (users, startDate, endDate, type) {
    const events = []

    if (!type || (type && type.includes('reg'))) {
      await Promise.all(
        users.map(user => {
          if (user.createdAt >= new Date(startDate) && user.createdAt <= new Date(endDate)) {
            events.push({
              timestamp: formatTime(user.createdAt),
              type: 'reg',
              click_id: user.affiliateCode?.replaceAll('-', ''),
              player_id: user.userId,
              amount: 0,
              currency: 'USD',
              event_id: user.userId
            })
          }
          return true
        })
      )
    }

    return events
  }

  async getBankingTransactions (TransactionBankingModel, UserModel, affiliateUsers, startDate, endDate, type) {
    const events = []

    const transactions = await TransactionBankingModel.findAll({
      attributes: [
        'updatedAt',
        'actioneeId',
        'amount',
        'transactionType',
        'isFirstDeposit',
        'transactionBankingId'
      ],
      where: {
        actioneeId: affiliateUsers,
        updatedAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        },
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: {
          [Op.in]: ['deposit', 'redeem']
        }
      },
      include: [
        {
          as: 'transactionUser',
          model: UserModel,
          attributes: ['userId', 'affiliateCode']
        }
      ]
    })

    await Promise.all(
      transactions.map(transaction => {
        const transactionType =
          transaction.transactionType === 'redeem' ? 'wdr' : transaction.isFirstDeposit ? 'ftd' : 'dep'
        if (!type || (type && type.includes(transactionType))) {
          events.push({
            timestamp: formatTime(transaction.updatedAt),
            type: transactionType,
            click_id: transaction.transactionUser.affiliateCode?.replaceAll('-', ''),
            player_id: transaction.actioneeId,
            amount: transaction.amount,
            currency: 'USD',
            event_id: transaction.transactionBankingId
          })
        }
        return true
      })
    )

    return events
  }

  async getCasinoTransaction (CasinoTransactionModel, UserModel, affiliateUsers, startDate, endDate, type) {
    const events = []

    const casinoTransactions = await CasinoTransactionModel.findAll({
      attributes: ['userId', 'actionType', 'amount', 'sc', 'updatedAt', 'casinoTransactionId'],
      where: {
        updatedAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        },
        userId: affiliateUsers,
        actionType: {
          [Op.in]: [ACTION.BET, ACTION.WIN, ...Object.values(BONUS_TYPE)]
        },
        status: TRANSACTION_STATUS.SUCCESS,
        amountType: {
          [Op.in]: [AMOUNT_TYPE.SC_COIN, AMOUNT_TYPE.SC_GC_COIN]
        }
      },
      include: [
        {
          attributes: ['userId', 'affiliateCode'],
          model: UserModel
        }
      ]
    })

    await Promise.all(
      casinoTransactions.map(casinoTransaction => {
        const transactionType = casinoTransaction.actionType === ACTION.BET ? 'bet' : casinoTransaction.actionType === ACTION.WIN ? 'win' : 'bon'
        if (!type || (type && type.includes(transactionType))) {
          events.push({
            timestamp: formatTime(casinoTransaction.updatedAt),
            type: transactionType,
            click_id: casinoTransaction.User.affiliateCode?.replaceAll('-', ''),
            player_id: casinoTransaction.userId,
            amount: +casinoTransaction.sc,
            currency: 'USD',
            event_id: casinoTransaction.casinoTransactionId
          })
        }
        return true
      })
    )

    return events
  }
}