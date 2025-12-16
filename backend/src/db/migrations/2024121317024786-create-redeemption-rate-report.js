'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('redeemption_rate_report', {
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
      redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      pending_redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      in_process_redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_revenue: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_pending_redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total_inprocess_redeemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      redeemptions_rate: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      lifetime_redeemptions_rate: {
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
    await queryInterface.dropTable('redeemption_rate_report', { schema: 'public' })
  }
}
