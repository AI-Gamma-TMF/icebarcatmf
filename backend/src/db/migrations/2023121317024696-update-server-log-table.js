'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      await queryInterface.changeColumn('server_logs', 'original_url', { type: Sequelize.TEXT, allowNull: true })
    ])
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
