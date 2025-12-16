'use strict'

module.exports = (sequelize, DataTypes) => {
  const RedeemRule = sequelize.define(
    'RedeemRule',
    {
      ruleId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ruleName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ruleCondition: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      completionTime: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isSubscriberOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      playerIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
      }
    },
    {
      sequelize,
      tableName: 'redeem_rule',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  // define association here:
  RedeemRule.associate = function (model) {}

  return RedeemRule
}
