'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('redeemption_rate_report', { schema: 'public' })
    await queryInterface.createTable('redemption_rate_report', {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      revenue: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      pending_redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      in_process_redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_revenue: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_pending_redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_inprocess_redemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      redemptions_rate: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      lifetime_redemptions_rate: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('redemption_rate_report', { schema: 'public' })
  }
}
