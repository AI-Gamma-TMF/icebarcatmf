'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('preferred_payments', 'recurring_user_subscription_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('preferred_payments', 'recurring_user_subscription_id')
  }
}
