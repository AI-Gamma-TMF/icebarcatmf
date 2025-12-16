'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournament', 'vip_tournament', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('tournament', 'allowed_users', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    await queryInterface.removeColumn('tournament', 'vip_tournament')
    await queryInterface.removeColumn('tournament', 'allowed_users')
  }
}
