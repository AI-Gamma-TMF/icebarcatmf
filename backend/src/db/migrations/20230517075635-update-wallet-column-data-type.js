'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'gc_coin',
      {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'sc_coin',
      {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        allowNull: true
      }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'gc_coin',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'sc_coin',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      )
    ])
  }
}
