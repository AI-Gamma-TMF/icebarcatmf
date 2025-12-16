'use strict'
module.exports = (sequelize, DataTypes) => {
  const DashboardReport = sequelize.define(
    'DashboardReport',
    {
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
      },
      // Customer Data
      registeredPlayerCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      realFirstTimePurchaserCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      testFirstTimePurchaserCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      realFirstTimePurchaserAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testFirstTimePurchaserAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      realPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      realPurchaseCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      testPurchaseCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      requestRedemptionAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      approvedRedemptionAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      cancelledRedemptionAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      requestRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      approvedRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      cancelledRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      pendingRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      pendingRedemptionAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      failedRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      failedRedemptionAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      // Coin Economy Data
      realGcCreditPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testGcCreditPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      realScCreditPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testScCreditPurchaseAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      realGcAwardedAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testGcAwardedAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      realScAwardedAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      testScAwardedAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      // Transaction Data
      scRealStakedSum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      scRealWinSum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      scTestStakedSum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      scTestWinSum: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      // Jackpot Data
      jackpotRevenue: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: 0.0
      },
      jackpotEntries: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
      },
      totalBetCount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
      },
      jackpotOptedInUsers: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: 'dashboard_reports',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  )

  return DashboardReport
}
