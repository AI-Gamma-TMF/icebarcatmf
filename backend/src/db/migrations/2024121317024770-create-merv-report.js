'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('merv_report', {
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true,
        primaryKey: true
      },

      total_sc_staked: Sequelize.DOUBLE,
      total_sc_staked_dow_avg: Sequelize.DOUBLE,
      delta_sc_staked: Sequelize.DOUBLE,

      dma7_total_sc_staked: Sequelize.DOUBLE,
      dma30_total_sc_staked: Sequelize.DOUBLE,

      total_ggr: Sequelize.DOUBLE,
      dma7_ggr: Sequelize.DOUBLE,
      dma30_ggr: Sequelize.DOUBLE,

      total_sc_awarded: Sequelize.DOUBLE,
      dma7_total_sc_awarded: Sequelize.DOUBLE,
      dma30_total_sc_awarded: Sequelize.DOUBLE,

      total_ngr: Sequelize.DOUBLE,
      dma7_total_ngr: Sequelize.DOUBLE,
      dma30_total_ngr: Sequelize.DOUBLE,

      unique_logins: Sequelize.INTEGER,
      dau: Sequelize.INTEGER,

      abpdau: Sequelize.DOUBLE,
      dma7_abpdau: Sequelize.DOUBLE,

      aggrp_dau: Sequelize.DOUBLE,
      dma7_aggrp_dau: Sequelize.DOUBLE,
      dma30_aggrp_dau: Sequelize.DOUBLE,

      angrp_dau: Sequelize.DOUBLE,
      dma7_angrp_dau: Sequelize.DOUBLE,
      dma30_angrp_dau: Sequelize.DOUBLE,

      total_deposits: Sequelize.DOUBLE,
      avg_deposits_on_day: Sequelize.DOUBLE,
      delta_deposits: Sequelize.DOUBLE,
      dma7_deposits: Sequelize.DOUBLE,
      dma30_deposits: Sequelize.DOUBLE,

      depositors: Sequelize.INTEGER,
      dma7_depositors: Sequelize.DOUBLE,
      dma30_depositors: Sequelize.DOUBLE,

      withdrawal_requested: Sequelize.INTEGER,
      withdrawal_completed: Sequelize.INTEGER,

      new_registered_players: Sequelize.INTEGER,
      dma7_new_registered: Sequelize.DOUBLE,
      dma30_new_registered: Sequelize.DOUBLE,

      first_time_purchasers: Sequelize.INTEGER,
      dma7_first_purchasers: Sequelize.DOUBLE,
      dma30_first_purchasers: Sequelize.DOUBLE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('merv_report')
  }
}
