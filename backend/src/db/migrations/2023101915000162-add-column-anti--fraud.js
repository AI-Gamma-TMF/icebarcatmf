'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'anti_fraud_rules',
      schema: 'public'
    }, 'emails',
    {
      type: Sequelize.JSONB,
      allowNull: true
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'anti_fraud_rules',
      schema: 'public'
    }, 'emails', Sequelize.JSONB)
  }
}
