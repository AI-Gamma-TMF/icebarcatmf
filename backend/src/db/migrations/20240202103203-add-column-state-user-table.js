'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('users')

    if (!tableInfo.state) {
      await queryInterface.addColumn(
        {
          tableName: 'users',
          schema: 'public'
        },
        'state',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        tableName: 'users',
        schema: 'public'
      },
      'state',
      Sequelize.STRING
    )
  }
}
