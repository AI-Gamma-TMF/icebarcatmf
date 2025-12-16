'use strict'

module.exports = (sequelize, DataTypes) => {
  const MervReport = sequelize.define(
    'MervReport',
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
        primaryKey: true
      },

      totalScStaked: {
        type: DataTypes.DOUBLE,
        field: 'total_sc_staked'
      },
      totalScStakedDowAvg: {
        type: DataTypes.DOUBLE,
        field: 'total_sc_staked_dow_avg'
      },
      deltaScStaked: {
        type: DataTypes.DOUBLE,
        field: 'delta_sc_staked'
      },

      dma7TotalScStaked: {
        type: DataTypes.DOUBLE,
        field: 'dma7_total_sc_staked'
      },
      dma30TotalScStaked: {
        type: DataTypes.DOUBLE,
        field: 'dma30_total_sc_staked'
      },

      totalGgr: {
        type: DataTypes.DOUBLE,
        field: 'total_ggr'
      },
      dma7Ggr: {
        type: DataTypes.DOUBLE,
        field: 'dma7_ggr'
      },
      dma30Ggr: {
        type: DataTypes.DOUBLE,
        field: 'dma30_ggr'
      },

      totalScAwarded: {
        type: DataTypes.DOUBLE,
        field: 'total_sc_awarded'
      },
      dma7TotalScAwarded: {
        type: DataTypes.DOUBLE,
        field: 'dma7_total_sc_awarded'
      },
      dma30TotalScAwarded: {
        type: DataTypes.DOUBLE,
        field: 'dma30_total_sc_awarded'
      },

      totalNgr: {
        type: DataTypes.DOUBLE,
        field: 'total_ngr'
      },
      dma7TotalNgr: {
        type: DataTypes.DOUBLE,
        field: 'dma7_total_ngr'
      },
      dma30TotalNgr: {
        type: DataTypes.DOUBLE,
        field: 'dma30_total_ngr'
      },

      uniqueLogins: {
        type: DataTypes.INTEGER,
        field: 'unique_logins'
      },
      dau: {
        type: DataTypes.INTEGER
      },

      abpdau: {
        type: DataTypes.DOUBLE
      },
      dma7Abpdau: {
        type: DataTypes.DOUBLE,
        field: 'dma7_abpdau'
      },

      aggrPdau: {
        type: DataTypes.DOUBLE,
        field: 'aggrp_dau'
      },
      dma7AggrPdau: {
        type: DataTypes.DOUBLE,
        field: 'dma7_aggrp_dau'
      },
      dma30AggrPdau: {
        type: DataTypes.DOUBLE,
        field: 'dma30_aggrp_dau'
      },

      angrPdau: {
        type: DataTypes.DOUBLE,
        field: 'angrp_dau'
      },
      dma7AngrPdau: {
        type: DataTypes.DOUBLE,
        field: 'dma7_angrp_dau'
      },
      dma30AngrPdau: {
        type: DataTypes.DOUBLE,
        field: 'dma30_angrp_dau'
      },

      totalDeposits: {
        type: DataTypes.DOUBLE,
        field: 'total_deposits'
      },
      avgDepositsOnDay: {
        type: DataTypes.DOUBLE,
        field: 'avg_deposits_on_day'
      },
      deltaDeposits: {
        type: DataTypes.DOUBLE,
        field: 'delta_deposits'
      },
      dma7Deposits: {
        type: DataTypes.DOUBLE,
        field: 'dma7_deposits'
      },
      dma30Deposits: {
        type: DataTypes.DOUBLE,
        field: 'dma30_deposits'
      },

      depositors: {
        type: DataTypes.INTEGER
      },
      dma7Depositors: {
        type: DataTypes.DOUBLE,
        field: 'dma7_depositors'
      },
      dma30Depositors: {
        type: DataTypes.DOUBLE,
        field: 'dma30_depositors'
      },

      withdrawalRequested: {
        type: DataTypes.INTEGER,
        field: 'withdrawal_requested'
      },
      withdrawalCompleted: {
        type: DataTypes.INTEGER,
        field: 'withdrawal_completed'
      },

      newRegisteredPlayers: {
        type: DataTypes.INTEGER,
        field: 'new_registered_players'
      },
      dma7NewRegistered: {
        type: DataTypes.DOUBLE,
        field: 'dma7_new_registered'
      },
      dma30NewRegistered: {
        type: DataTypes.DOUBLE,
        field: 'dma30_new_registered'
      },

      firstTimePurchasers: {
        type: DataTypes.INTEGER,
        field: 'first_time_purchasers'
      },
      dma7FirstPurchasers: {
        type: DataTypes.DOUBLE,
        field: 'dma7_first_purchasers'
      },
      dma30FirstPurchasers: {
        type: DataTypes.DOUBLE,
        field: 'dma30_first_purchasers'
      },
      bonusData: {
        type: DataTypes.JSONB,
        field: 'bonus_data'
      }
    },
    {
      sequelize,
      tableName: 'merv_report',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  )

  return MervReport
}
