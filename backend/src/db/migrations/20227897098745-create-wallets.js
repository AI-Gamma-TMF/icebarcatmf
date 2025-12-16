'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('wallets', {
      wallet_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0
      },
      currency_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      owner_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      non_cash_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0
      },
      gc_coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      sc_coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('wallets', { schema: 'public' })
  }
}
