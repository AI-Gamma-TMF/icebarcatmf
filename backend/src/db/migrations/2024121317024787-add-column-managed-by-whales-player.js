'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('whale_players', 'managed_by', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('whale_players', 'managed_by')
    ])
  }
}
