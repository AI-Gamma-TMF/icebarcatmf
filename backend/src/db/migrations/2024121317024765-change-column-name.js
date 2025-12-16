'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'master_casino_games',
      'restrictions',
      'free_spin_bet_scale_amount'
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'master_casino_games',
      'free_spin_bet_scale_amount',
      'restrictions'
    )
  }
}
