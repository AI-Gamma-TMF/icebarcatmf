'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('casino_transactions', ['transaction_id'], { name: 'casino_transaction_transaction_id_index' })
      await queryInterface.addIndex('casino_transactions', ['round_id', 'round_status'], { name: 'casino_transaction_round_id_round_status_index' })
      await queryInterface.addIndex('casino_transactions', ['session_id'], { name: 'casino_transaction_session_id_index' })
    } catch (error) {
      console.log('Error while adding indexes')
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
