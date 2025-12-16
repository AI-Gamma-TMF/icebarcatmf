'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('chargeback_transactions', 'should_fight', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chargeback_transactions', 'should_fight')
  }
}
