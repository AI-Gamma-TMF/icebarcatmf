'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('casino_game_lifetime_analytics', {
      schema: 'public'
    })
  },

  down: async (queryInterface, Sequelize) => {
  }
}
