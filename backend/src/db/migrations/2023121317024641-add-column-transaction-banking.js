'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('transaction_bankings')
    if (!tableInfo.before_balance) {
      await queryInterface.addColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'before_balance',
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
        tableName: 'transaction_bankings',
        schema: 'public'
      },
      'before_balance',
      Sequelize.STRING
    )
  }
}
