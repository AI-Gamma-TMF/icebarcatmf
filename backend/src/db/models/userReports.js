'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserReports = sequelize.define(
    'UserReports',
    {
      userId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      totalPurchaseAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      purchaseCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalRedemptionAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      redemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalPendingRedemptionAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      pendingRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalScBetAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      totalScWinAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      cancelledRedemptionCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cancelledRedemptionAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'user_reports',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  UserReports.associate = function (model) {
    UserReports.belongsTo(model.User, { foreignKey: 'userId', as: 'UserReport' })
  }

  return UserReports
}
