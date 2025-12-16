'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'users',
        schema: 'public'
      }, 'auth_secret',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'users',
        schema: 'public'
      }, 'auth_url',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'users',
        schema: 'public'
      }, 'auth_enable',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'users', schema: 'public' },
        'auth_secret', Sequelize.STRING),
      queryInterface.removeColumn({ tableName: 'users', schema: 'public' },
        'auth_url', Sequelize.STRING),
      queryInterface.removeColumn({ tableName: 'users', schema: 'public' },
        'auth_enable', Sequelize.STRING)
    ])
  }
}
