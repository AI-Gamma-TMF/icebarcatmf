'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'more_details',
      {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'more_details', Sequelize.JSONB)
    ])
  }
}
