const { default: db } = require('../models')
const { TRANSACTION_TYPE } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()

    try {
      const data = await db.TransactionBanking.findAll({
        where: {
          transactionType: TRANSACTION_TYPE.DEPOSIT
        },
        transaction: sequelizeTransaction
      })

      const promoCodeIds = (await db.Promocode.findAll({ transaction: sequelizeTransaction })).map((promocode) => +promocode.promocodeId)
      await Promise.all(
        data.map(async (transaction) => {
          if (!transaction?.moreDetails) return
          const details = typeof (transaction.moreDetails) === 'string' ? JSON.parse(transaction.moreDetails) : transaction.moreDetails

          const promocodeId = details?.promocode?.promocodeId

          if (promocodeId && promoCodeIds.includes(promocodeId)) {
            await db.TransactionBanking.update(
              { promocodeId: promocodeId },
              {
                where: { transactionBankingId: transaction.transactionBankingId },
                transaction: sequelizeTransaction
              }
            )
          }
        })
      )
      await sequelizeTransaction.commit()
    } catch (error) {
      await sequelizeTransaction.rollback()
      console.log(error)
      // throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
