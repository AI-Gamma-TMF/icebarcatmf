'use strict'

module.exports = (sequelize, DataTypes) => {
  const SubscriptionFeatureMap = sequelize.define('SubscriptionFeatureMap', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subscriptionFeatureId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING, // Store all values as string; cast using Feature.valueType
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'subscription_feature_map',
    timestamps: true,
    underscored: true
  })

  SubscriptionFeatureMap.associate = function (models) {
    SubscriptionFeatureMap.belongsTo(models.SubscriptionFeature, {
      foreignKey: 'subscriptionFeatureId',
      as: 'featureDetail'
    })

    SubscriptionFeatureMap.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId'
    })
  }

  return SubscriptionFeatureMap
}
