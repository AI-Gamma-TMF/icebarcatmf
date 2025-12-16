'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_reports', 'ggr')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_reports', 'ggr', {
      type: Sequelize.DECIMAL,
      allowNull: true
    })
  }
}
