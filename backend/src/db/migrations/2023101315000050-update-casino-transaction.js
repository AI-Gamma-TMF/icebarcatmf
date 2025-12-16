'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'gc',
      {
        type: Sequelize.DOUBLE(10, 2),
        defaultValue: 0.0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'sc',
      {
        type: Sequelize.DOUBLE(10, 2),
        defaultValue: 0.0,
        allowNull: true
      }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'gc',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'casino_transactions',
        schema: 'public'
      }, 'sc',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      )
    ])
  }
}
