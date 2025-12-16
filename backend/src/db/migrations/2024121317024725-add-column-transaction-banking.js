'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_bankings', 'bonus_sc', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.addColumn('transaction_bankings', 'bonus_gc', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.addColumn('transaction_bankings', 'deposit_transaction_id', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('transaction_bankings', 'bonus_sc')
    await queryInterface.removeColumn('transaction_bankings', 'bonus_gc')
    await queryInterface.removeColumn('transaction_bankings', 'deposit_transaction_id')
  }
}
