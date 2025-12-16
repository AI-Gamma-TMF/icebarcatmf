'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_casino_providers', 'provider_identifier', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('master_casino_providers', 'provider_identifier')
  }
}
