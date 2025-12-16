'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('DROP MATERIALIZED VIEW game_unique_players CASCADE;')
  },

  down: async (queryInterface, DataTypes) => {
  }
}
