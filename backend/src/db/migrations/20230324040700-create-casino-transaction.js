'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('casino_transactions', {
      casino_transaction_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      action_type: { // bet, win, cancel
        type: DataTypes.STRING
      },
      action_id: { //  DEBIT: '0', CREDIT: '1', CANCEL: '2'
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      game_identifier: {
        type: DataTypes.STRING,
        allowNull: true
      },
      game_id: {
        type: DataTypes.STRING
      },
      wallet_id: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.INTEGER
      },
      currency_code: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      before_balance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      after_balance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      amount_type: { // 0 = gc, 1 = sc
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      elastic_updated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_sticky: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      user_bonus_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      round_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      round_status: { // false = round open ,  true = round close
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: true
      },
      device: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sc: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      gc: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('casino_transactions', { schema: 'public' })
  }
}
