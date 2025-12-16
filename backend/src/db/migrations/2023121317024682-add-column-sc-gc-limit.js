'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admin_users', 'sc_limit', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.addColumn('admin_users', 'gc_limit', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('admin_users', 'sc_limit')
    await queryInterface.removeColumn('admin_users', 'gc_limit')
  }
}
