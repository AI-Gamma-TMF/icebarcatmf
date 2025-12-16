'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('limits', {
      limit_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
      time_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      time_limit_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      time_limit_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_bet_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      daily_bet_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_bet_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_bet_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      weekly_bet_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_bet_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_bet_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      monthly_bet_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_bet_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_loss_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      daily_loss_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_loss_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_loss_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      weekly_loss_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_loss_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_loss_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      monthly_loss_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_loss_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_deposit_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      daily_deposit_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daily_deposit_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_deposit_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      weekly_deposit_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      weekly_deposit_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_deposit_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      monthly_deposit_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      monthly_deposit_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      self_exclusion: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_self_exclusion_permanent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      self_exclusion_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      self_exclusion_updated_at: {
        type: DataTypes.DATE,
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
    await queryInterface.dropTable('limits', { schema: 'public' })
  }
}
