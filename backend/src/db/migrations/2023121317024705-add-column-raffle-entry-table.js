'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('raffles_entry', 'is_winner', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('raffles_entry', 'sc_win', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    })
    await queryInterface.addColumn('raffles_entry', 'gc_win', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
