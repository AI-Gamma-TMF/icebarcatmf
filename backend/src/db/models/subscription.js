'use strict'

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subscriptionId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    monthlyAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    yearlyAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    weeklyPurchaseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gcCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    platform: {
      type: DataTypes.ENUM('web', 'ios', 'android', 'all'),
      allowNull: false,
      defaultValue: 'all'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    specialPlan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'subscriptions',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: true
  })

  Subscription.associate = function (models) {
    Subscription.hasMany(models.UserSubscription, {
      foreignKey: 'subscriptionId',
      as: 'userSubscriptions'
    })
    Subscription.hasMany(models.SubscriptionFeatureMap, {
      foreignKey: 'subscriptionId',
      as: 'features'
    })
  }

  return Subscription
}
