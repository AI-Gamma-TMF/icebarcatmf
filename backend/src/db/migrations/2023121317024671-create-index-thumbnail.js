'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('master_casino_games_thumbnail', ['master_casino_game_id'], {
        name: 'master_casino_games_thumbnail_master_casino_game_id_index'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('favorite_games', 'master_casino_games_thumbnail_master_casino_game_id_index')
  }

}
