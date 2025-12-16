'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.allSettled([
      queryInterface.removeColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'transaction_date_time', Sequelize.STRING),
      queryInterface.addColumn({
        tableName: 'withdraw_requests',
        schema: 'public'
      }, 'more_details',
      {
        type: Sequelize.JSONB,
        allowNull: true
      }),
      queryInterface.addColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'transaction_date_time',
      {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.removeColumn({
        tableName: 'withdraw_requests',
        schema: 'public'
      }, 'phone_number', Sequelize.STRING)
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({
        tableName: 'users',
        schema: 'public'
      }, 'kyc_applicant_id', Sequelize.STRING)
    ])
  }
}
