'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('favorite_games', ['user_id'], {
      name: 'favorite_games_user_id_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('favorite_games', 'favorite_games_user_id_index')
  }

}
