'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('master_game_sub_categories', 'master_game_category_id', {
      schema: 'public'
    })
    await queryInterface.dropTable('master_game_categories', { schema: 'public' })
    await queryInterface.dropTable('master_casino_games_thumbnail', { schema: 'public' })
  },

  down: async (queryInterface, Sequelize) => {
  }
}
