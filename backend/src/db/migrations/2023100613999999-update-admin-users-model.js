'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'admin_users',
        schema: 'public'
      }, 'auth_secret',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'admin_users',
        schema: 'public'
      }, 'auth_url',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'admin_users',
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
      queryInterface.removeColumn({ tableName: 'admin_users', schema: 'public' },
        'authSecret', Sequelize.STRING),
      queryInterface.removeColumn({ tableName: 'admin_users', schema: 'public' },
        'authUrl', Sequelize.INTEGER),
      queryInterface.removeColumn({ tableName: 'admin_users', schema: 'public' },
        'authEnable', Sequelize.STRING)
    ])
  }
}
