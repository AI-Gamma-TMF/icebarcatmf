'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('chargeback_transactions', 'additional_data', {
      type: Sequelize.JSONB,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chargeback_transactions', 'additional_data')
  }
}
