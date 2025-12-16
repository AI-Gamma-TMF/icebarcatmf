'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('user_tournament', 'gc_win_amount', 'gc_bet')
    await queryInterface.renameColumn('user_tournament', 'sc_win_amount', 'sc_bet')
    await queryInterface.addColumn('user_tournament', 'is_booted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('user_tournament', 'ggr', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('user_tournament', 'gc_bet', 'gc_win_amount')
    await queryInterface.renameColumn('user_tournament', 'sc_bet', 'sc_win_amount')
    await queryInterface.removeColumn('user_tournament', 'is_booted')
    await queryInterface.removeColumn('user_tournament', 'ggr')
  }
}
