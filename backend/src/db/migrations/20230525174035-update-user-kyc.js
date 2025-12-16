'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'users',
        schema: 'public'
      }, 'kyc_applicant_id',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
      ),
      queryInterface.addColumn({
        tableName: 'withdraw_requests',
        schema: 'public'
      }, 'actionable_email',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
      ),
      queryInterface.removeColumn({
        tableName: 'withdraw_requests',
        schema: 'public'
      }, 'actionable_type', Sequelize.STRING)
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
