'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn({
        tableName: 'bonus',
        schema: 'public'
      }, 'gc_amount',
      {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'bonus',
        schema: 'public'
      }, 'sc_amount',
      {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'user_bonus',
        schema: 'public'
      }, 'gc_amount',
      {
        type: Sequelize.DOUBLE(10, 2),
        defaultValue: 0.0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'user_bonus',
        schema: 'public'
      }, 'sc_amount',
      {
        type: Sequelize.DOUBLE(10, 2),
        defaultValue: 0.0,
        allowNull: true
      }
      ),
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
        tableName: 'bonus',
        schema: 'public'
      }, 'gc_amount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'bonus',
        schema: 'public'
      }, 'sc_amount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'user_bonus',
        schema: 'public'
      }, 'gc_amount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
      queryInterface.changeColumn({
        tableName: 'user_bonus',
        schema: 'public'
      }, 'sc_amount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
      ),
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
