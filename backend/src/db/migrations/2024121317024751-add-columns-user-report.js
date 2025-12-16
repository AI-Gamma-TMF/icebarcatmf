'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_reports', 'cancelled_redemption_amount', {
      type: Sequelize.BIGINT,
      default: 0,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_reports', 'cancelled_redemption_amount')
  }
}
