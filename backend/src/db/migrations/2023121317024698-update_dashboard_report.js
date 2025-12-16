'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Promise.all([
         queryInterface.addColumn('dashboard_report', 'total_real_unique_login_count', {
            type: Sequelize.JSONB,
            allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_test_unique_login_count', {
            type: Sequelize.JSONB,
            allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_real_login_count', {
          type: Sequelize.INTEGER,
          allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_test_login_count', {
          type: Sequelize.INTEGER,
          allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_real_registered_player_count', {
            type: Sequelize.INTEGER,
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_registered_player_count', {
            type: Sequelize.INTEGER,
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_first_time_purchaser_count', {
            type: Sequelize.INTEGER,
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_first_time_purchaser_count', {
            type: Sequelize.INTEGER,
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_first_time_purchaser_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_first_time_purchaser_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_average_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_average_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_purchase_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_purchase_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_approved_redemption_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_approved_redemption_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_request_redemption_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_request_redemption_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_redemption_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_redemption_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_pending_redemption_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_pending_redemption_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_net_revenue_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_net_revenue_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_gc_credit_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_gc_credit_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_sc_credit_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_sc_credit_purchase_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_gc_awarded_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_gc_awarded_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_sc_awarded_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_sc_awarded_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_sc_stacked_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_sc_stacked_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_sc_win_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_test_sc_win_amount', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'real_house_edge_percentage', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'test_house_edge_percentage', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'real_ggr_sc', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'test_ggr_sc', {
            type: Sequelize.DOUBLE(10, 2),
            allowNull: true,
            defaultValue: 0.0
          }),
         queryInterface.addColumn('dashboard_report', 'total_real_active_gc_players_count', {
            type: Sequelize.JSONB,
            allowNull: true
        }), 
         queryInterface.addColumn('dashboard_report', 'total_test_active_gc_players_count', {
            type: Sequelize.JSONB,
            allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_real_active_sc_players_count', {
            type: Sequelize.JSONB,
            allowNull: true
        }),
         queryInterface.addColumn('dashboard_report', 'total_test_active_sc_players_count', {
            type: Sequelize.JSONB,
            allowNull: true
        })
    ])
    
  },
  down: async (queryInterface, Sequelize) => {
    return await Promise.all([
        queryInterface.removeColumn('dashboard_report', 'total_real_unique_login_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_unique_login_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_login_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_login_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_registered_player_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_registered_player_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_first_time_purchaser_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_first_time_purchaser_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_first_time_purchaser_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_first_time_purchaser_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_average_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_average_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_purchase_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_purchase_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_approved_redemption_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_approved_redemption_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_request_redemption_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_request_redemption_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_redemption_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_redemption_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_pending_redemption_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_pending_redemption_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_net_revenue_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_net_revenue_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_gc_credit_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_gc_credit_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_sc_credit_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_sc_credit_purchase_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_gc_awarded_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_gc_awarded_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_sc_awarded_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_sc_awarded_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_sc_stacked_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_sc_stacked_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_real_sc_win_amount'),
        queryInterface.removeColumn('dashboard_report', 'total_test_sc_win_amount'),
        queryInterface.removeColumn('dashboard_report', 'real_house_edge_percentage'),
        queryInterface.removeColumn('dashboard_report', 'test_house_edge_percentage'),
        queryInterface.removeColumn('dashboard_report', 'real_ggr_sc'),
        queryInterface.removeColumn('dashboard_report', 'test_ggr_sc'),
        queryInterface.removeColumn('dashboard_report', 'total_real_active_gc_players_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_active_gc_players_count'),
        queryInterface.removeColumn('dashboard_report', 'total_real_active_sc_players_count'),
        queryInterface.removeColumn('dashboard_report', 'total_test_active_sc_players_count')
    ])
  }
};
