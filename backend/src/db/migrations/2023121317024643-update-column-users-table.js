'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'document_labels')
    await queryInterface.removeColumn('users', 'requested_documents')
    await queryInterface.addColumn(
      {
        tableName: 'users',
        schema: 'public'
      },
      'paysafe_customer_id',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'paysafe_customer_id')
  }
}
