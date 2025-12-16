'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await Promise.all([
      queryInterface.changeColumn('chargeback_transactions', 'arn', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'amount', {
        type: DataTypes.INTEGER,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'card_scheme', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'currency', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'due_date', {
        type: DataTypes.DATE,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'posting_date', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'psp', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'reason', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'reason_code', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'psp_status', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'status', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('chargeback_transactions', 'transaction_created_date', {
        type: DataTypes.DATE,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, DataTypes) => {
    await Promise.all([
      queryInterface.changeColumn('chargeback_transactions', 'arn', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'amount', {
        type: DataTypes.INTEGER,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'card_scheme', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'currency', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'due_date', {
        type: DataTypes.DATE,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'posting_date', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'psp', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'reason', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'reason_code', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'psp_status', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'status', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('chargeback_transactions', 'transaction_created_date', {
        type: DataTypes.DATE,
        allowNull: false
      })
    ])
  }
}
