'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('transaction_bankings', {
      transaction_banking_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      actionee_type: {
        type: DataTypes.STRING
      },
      actionee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      actionee_email: {
        type: DataTypes.STRING
      },
      actionee_name: {
        type: DataTypes.STRING
      },
      wallet_id: {
        type: DataTypes.INTEGER
      },
      currency_code: {
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.FLOAT
      },
      before_balance: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      transaction_date_time: {
        type: DataTypes.STRING
      },
      transaction_type: {
        type: DataTypes.STRING
      },
      is_success: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      state: {
        type: DataTypes.STRING
      },
      payment_method: {
        type: DataTypes.STRING
      },
      payment_transaction_id: {
        type: DataTypes.STRING
      },
      more_details: {
        type: DataTypes.JSONB
      },
      is_first_deposit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      elastic_updated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      gc_coin: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      sc_coin: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      after_balance: {
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
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('transaction_bankings', { schema: 'public' })
  }
}
