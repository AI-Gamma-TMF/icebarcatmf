'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dashboard_reports', 'jackpot_entries', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      allowNull: true
    })
    await queryInterface.addColumn('dashboard_reports', 'total_bet_count', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      allowNull: true
    })
    await queryInterface.addColumn('dashboard_reports', 'jackpot_opted_in_users', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('dashboard_reports', 'jackpot_entries'),
      queryInterface.removeColumn('dashboard_reports', 'total_bet_count'),
      queryInterface.removeColumn('dashboard_reports', 'jackpot_opted_in_users')
    ])
  }
}
