'use strict'

module.exports = (sequelize, DataTypes) => {
  const RedemptionRateReport = sequelize.define(
    'RedemptionRateReport',
    {
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
      pendingRedemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      inProcessRedemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalRevenue: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalRedemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalPendingRedemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalInprocessRedemptions: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      redemptionsRate: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      lifetimeRedemptionsRate: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'redemption_rate_report',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  return RedemptionRateReport
}
