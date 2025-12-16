'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dashboard_reports', 'jackpot_revenue', {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('dashboard_reports', 'jackpot_revenue')
    ])
  }
}
