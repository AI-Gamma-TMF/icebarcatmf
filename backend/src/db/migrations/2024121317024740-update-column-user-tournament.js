'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename existing columns
    await queryInterface.renameColumn('user_tournament', 'sc_bet', 'player_bet')
    await queryInterface.renameColumn('user_tournament', 'gc_bet', 'player_win')
  },

  down: async (queryInterface, Sequelize) => {
    // Revert column renames
    await queryInterface.renameColumn('user_tournament', 'player_bet', 'sc_bet')
    await queryInterface.renameColumn('user_tournament', 'player_win', 'gc_bet')
  }
}
