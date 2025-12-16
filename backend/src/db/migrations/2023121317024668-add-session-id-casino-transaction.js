'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('casino_transactions', 'session_id', {
      type: Sequelize.TEXT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('casino_transactions', 'session_id')
  }
}
