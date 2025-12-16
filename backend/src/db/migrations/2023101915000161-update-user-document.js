'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'user_documents',
      schema: 'public'
    }, 'document_expiry',
    {
      type: Sequelize.DATE,
      allowNull: true
    }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'user_documents',
      schema: 'public'
    }, 'document_expiry', Sequelize.DATE)
  }
}
