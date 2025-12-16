'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('dashboard_report', {
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
      },
      sc_real_staked_sum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false
      },
      sc_real_win_sum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false
      },
      sc_test_staked_sum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false
      },
      sc_test_win_sum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dashboard_report')
  }
}
