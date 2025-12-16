'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('transaction_bankings', 'user_bonus_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaction_bankings', 'user_bonus_id')
  }
}
