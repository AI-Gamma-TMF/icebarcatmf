'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('casino_transactions', 'tournamentId', 'tournament_id')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('casino_transactions', 'tournament_id', 'tournamentId')
  }
}
