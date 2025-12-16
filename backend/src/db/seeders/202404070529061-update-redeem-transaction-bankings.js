'use strict'
import db from '../models'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()

    try {
      // Basic Update
      await queryInterface.sequelize.query(
        "UPDATE transaction_bankings SET payment_method = 'SKRILL' WHERE payment_method = 'PAYSAFE' AND transaction_type = 'redeem'",
        {
          transaction: sequelizeTransaction
        }
      )

      // Major Update
      const {
        WithdrawRequest: WithdrawRequestModel,
        TransactionBanking: TransactionBankingModel
      } = db

      const totalTransactions = await WithdrawRequestModel.count({
        where: {
          status: [TRANSACTION_STATUS.INPROGRESS, TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.FAILED]
        },
        transaction: sequelizeTransaction
      })
      for (let i = 0; i < totalTransactions; i += 1000) {
        const transactions = await WithdrawRequestModel.findAll({
          attributes: ['withdrawRequestId', 'transactionId', 'moreDetails'],
          where: {
            status: [TRANSACTION_STATUS.INPROGRESS, TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.FAILED]
          },
          transaction: sequelizeTransaction,
          order: [['withdrawRequestId', 'ASC']],
          raw: true,
          limit: 1000,
          offset: i
        })
        await Promise.all(transactions.map(async transaction => {
          const detail = typeof transaction.moreDetails === 'string' ? JSON.parse(transaction.moreDetails) : transaction.moreDetails
          if (detail?.id && transaction?.transactionId) {
            await TransactionBankingModel.update(
              { transactionId: transaction.transactionId },
              {
                where: {
                  paymentTransactionId: detail?.id
                },
                transaction: sequelizeTransaction,
                silent: true
              }
            )
          }
        }))
      }
      await sequelizeTransaction.commit()
    } catch (error) {
      console.log('Error while running redeem transaction seeder', error)
      await sequelizeTransaction.rollback()
    }
  },

  down: async (queryInterface, Sequelize) => {}
}
