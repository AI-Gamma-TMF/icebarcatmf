'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournament', 'total_win', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.addColumn('tournament', 'total_bet', {
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
    await queryInterface.removeColumn('tournament', 'total_win')
    await queryInterface.removeColumn('tournament', 'total_bet')
  }
}
