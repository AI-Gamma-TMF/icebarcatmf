'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('merv_report', 'bonus_data', {
      type: Sequelize.JSON,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('merv_report', 'bonus_data')
  }
}
