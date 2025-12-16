'use strict'
module.exports = function (sequelize, DataTypes) {
  const antiFraudRules = sequelize.define('antiFraudRules', {
    antiFraudRuleId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'anti_fraud_rule_id'
    },
    ruleName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'rule_name'
    },
    providerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'provider_id'
    },
    activity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'redemptions:1, login:2, registered-data:3, purchase:4, wins:5'
    },
    countryId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'country_id'
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'group_id'
    },
    singleAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'single_amount'
    },
    sumAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'sum_amount'
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    withSameIp: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'with_same_ip'
    },
    withSameDevice: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'with_same_device'
    },
    isDuplicate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_duplicate'
    },
    isSameAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_same_address'
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_email'
    },
    isRestrict: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_restrict'
    },
    isAlert: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_alert'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_active'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_deleted',
      defaultValue: false
    },
    emails: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'emails',
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'anti_fraud_rules',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: 'anti_fraud_rules_pkey',
        unique: true,
        fields: [
          { name: 'anti_fraud_rule_id' }
        ]
      }
    ]
  })
  antiFraudRules.associate = function (models) {
    antiFraudRules.hasOne(models.PlayerGroup, {
      as: 'group',
      sourceKey: 'groupId',
      foreignKey: 'groupId',
      onDelete: 'cascade'
    })

    antiFraudRules.hasOne(models.Country, {
      as: 'country',
      sourceKey: 'countryId',
      foreignKey: 'countryId',
      onDelete: 'cascade'
    })
  }
  return antiFraudRules
}
