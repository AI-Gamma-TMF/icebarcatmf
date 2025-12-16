'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('chargeback_transactions', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      chargeback_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      chargeback_uuid: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      arn: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      card_scheme: {
        type: DataTypes.STRING,
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      posting_date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      psp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reason_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      psp_status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transaction_created_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('chargeback_transactions')
  }
}
