'use strict'

module.exports = (sequelize, DataTypes) => {
  const SubscriptionFeature = sequelize.define('SubscriptionFeature', {
    subscriptionFeatureId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valueType: {
      type: DataTypes.ENUM('boolean', 'integer', 'float', 'string', 'json'),
      allowNull: false,
      defaultValue: 'string' // used to cast values in frontend/backend
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'subscription_features',
    timestamps: true,
    underscored: true
  })

  SubscriptionFeature.associate = function (models) {
    SubscriptionFeature.hasMany(models.SubscriptionFeatureMap, {
      foreignKey: 'subscriptionFeatureId',
      as: 'featureDetail'
    })
  }

  return SubscriptionFeature
}
