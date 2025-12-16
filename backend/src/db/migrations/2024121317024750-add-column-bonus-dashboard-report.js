'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dashboard_reports', 'bonus_data', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {} // Initializes as empty JSON object
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dashboard_reports', 'bonus_data')
  }
}
