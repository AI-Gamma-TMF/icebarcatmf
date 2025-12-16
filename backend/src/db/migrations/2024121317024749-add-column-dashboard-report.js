'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('dashboard_reports', 'pending_redemption_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }),
      queryInterface.addColumn('dashboard_reports', 'pending_redemption_amount', {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: true
      }),
      await queryInterface.addColumn('dashboard_reports', 'failed_redemption_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }),
      await queryInterface.addColumn('dashboard_reports', 'failed_redemption_amount', {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('dashboard_reports', 'failed_redemption_count'),
      queryInterface.removeColumn('dashboard_reports', 'failed_redemption_amount'),
      queryInterface.removeColumn('dashboard_reports', 'pending_redemption_count'),
      queryInterface.removeColumn('dashboard_reports', 'pending_redemption_amount')
    ])
  }
}
