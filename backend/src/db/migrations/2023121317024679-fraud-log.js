'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'fraud_log',
      {
        fraud_log_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true
        },
        ip: { 
          type: DataTypes.STRING,
          allowNull: true
        },
        seon_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        fraud_score: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        applied_rules: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        more_details: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        }
      },
      {
        schema: 'public'
      }
    )
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('fraud_log')
  }
}
