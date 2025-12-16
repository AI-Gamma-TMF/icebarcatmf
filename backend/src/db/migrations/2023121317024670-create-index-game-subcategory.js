'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('game_subcategory', ['master_casino_game_id'], {
      name: 'game_subcategory_master_casino_game_id_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('favorite_games', 'game_subcategory_master_casino_game_id_index')
  }

}
