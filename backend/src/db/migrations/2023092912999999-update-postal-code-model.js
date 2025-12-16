'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'postal_code_csv',
        schema: 'public'
      }, 'user_name',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'postal_code_csv',
        schema: 'public'
      }, 'success_count',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
      ),
      queryInterface.addColumn({
        tableName: 'postal_code_csv',
        schema: 'public'
      }, 'failed_count',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
      ),
      queryInterface.addColumn({
        tableName: 'postal_codes',
        schema: 'public'
      }, 'status',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'postal_code_csv', schema: 'public' },
        'user_name', Sequelize.STRING),
      queryInterface.removeColumn({ tableName: 'postal_code_csv', schema: 'public' },
        'failed_count', Sequelize.INTEGER),
      queryInterface.removeColumn({ tableName: 'postal_code_csv', schema: 'public' },
        'success_count', Sequelize.INTEGER),
      queryInterface.removeColumn({ tableName: 'postal_codes', schema: 'public' },
        'status', Sequelize.INTEGER)
    ])
  }
}
