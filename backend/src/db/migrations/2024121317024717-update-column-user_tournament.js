'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename existing columns
    await queryInterface.renameColumn('user_tournament', 'gc_bet', 'gc_win_amount')
    await queryInterface.renameColumn('user_tournament', 'sc_bet', 'sc_win_amount')

    // Add new columns with the same original names
    await queryInterface.addColumn('user_tournament', 'sc_bet', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.addColumn('user_tournament', 'gc_bet', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Remove newly added columns
    await queryInterface.removeColumn('user_tournament', 'sc_bet')
    await queryInterface.removeColumn('user_tournament', 'gc_bet')

    // Revert column renames
    await queryInterface.renameColumn('user_tournament', 'gc_win_amount', 'gc_bet')
    await queryInterface.renameColumn('user_tournament', 'sc_win_amount', 'sc_bet')
  }
}
