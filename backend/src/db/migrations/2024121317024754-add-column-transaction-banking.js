'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_bankings', 'promocode_bonus_sc', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    })
    await queryInterface.addColumn('transaction_bankings', 'promocode_bonus_gc', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    })
    await queryInterface.addColumn('transaction_bankings', 'promocode_discount', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('transaction_bankings', 'promocode_bonus_sc')
    await queryInterface.removeColumn('transaction_bankings', 'promocode_bonus_gc')
    await queryInterface.removeColumn('transaction_bankings', 'promocode_discount')
  }
}
