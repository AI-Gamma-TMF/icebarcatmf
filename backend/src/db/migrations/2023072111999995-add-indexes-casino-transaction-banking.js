'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add index to transaction_bankings
      await queryInterface.addIndex('transaction_bankings', ['actionee_id'], {
        name: 'transaction_bankings_actionee_id_index'
      })

      // Add index to casino_transactions
      await queryInterface.addIndex('casino_transactions', ['user_id'], {
        name: 'casino_transactions_user_id_index'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index from transaction_bankings
    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_id_index')

    // Remove index from casino_transactions
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_user_id_index')
  }
}
