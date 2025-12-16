'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('whale_players', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_purchase_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
      },
      purchase_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      total_redemption_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
      },
      redemption_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      total_pending_redemption_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
      },
      pending_redemption_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      cancelled_redemption_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      total_sc_bet_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
      },
      total_sc_win_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
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
    await queryInterface.dropTable('whalePlayers')
  }
}
