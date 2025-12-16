'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.addColumn('master_casino_providers', 'order_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_casino_providers', 'order_id')
  }
}
