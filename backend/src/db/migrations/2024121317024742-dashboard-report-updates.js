const { default: Logger } = require('../../libs/logger')

module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS public.dashboard_report;',
        { transaction }
      )
      await queryInterface.createTable('dashboard_reports', {
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          primaryKey: true
        },
        // Customer Data
        registered_player_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        real_first_time_purchaser_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        test_first_time_purchaser_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        real_first_time_purchaser_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_first_time_purchaser_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        real_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        real_purchase_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        test_purchase_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        request_redemption_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        approved_redemption_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        cancelled_redemption_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        request_redemption_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        approved_redemption_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        cancelled_redemption_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        // Coin Economy Data
        real_gc_credit_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_gc_credit_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        real_sc_credit_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_sc_credit_purchase_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        real_gc_awarded_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_gc_awarded_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        real_sc_awarded_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        test_sc_awarded_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        // Transaction Data
        sc_real_staked_sum: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: false,
          defaultValue: 0.0
        },
        sc_real_win_sum: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: false,
          defaultValue: 0.0
        },
        sc_test_staked_sum: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: false,
          defaultValue: 0.0
        },
        sc_test_win_sum: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: false,
          defaultValue: 0.0
        }
      })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      Logger.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
