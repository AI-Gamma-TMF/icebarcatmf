'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_reports', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ggr: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      total_purchase_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      purchase_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_redemption_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      redemption_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_pending_redemption_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      pending_redemption_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_sc_bet_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      total_sc_win_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      cancelled_redemption_count: {
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
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_reports', { schema: 'public' })
  }
}
