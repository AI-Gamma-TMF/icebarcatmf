'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.sequelize.query('DROP TRIGGER IF EXISTS refresh_view_on_mga ON master_game_aggregators;'),
        queryInterface.sequelize.query('DROP TRIGGER IF EXISTS refresh_view_on_mcp ON master_casino_providers;'),
        queryInterface.sequelize.query('DROP TRIGGER IF EXISTS refresh_view_on_mgsc ON master_game_sub_categories;'),
        queryInterface.sequelize.query('DROP TRIGGER IF EXISTS refresh_view_on_gsc ON game_subcategory;'),
        queryInterface.sequelize.query('DROP TRIGGER IF EXISTS refresh_view_on_mcg ON master_casino_games;')
      ])
      await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS refresh_game_data_view()')
    } catch (error) {
      throw Error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {}
}
