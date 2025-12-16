'use strict'

const { CRM_PROMOTION_TYPE } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const CRMPromotion = sequelize.define(
    'CRMPromotion',
    {
      crmPromotionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      promocode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      campaignId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      userIds: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: false,
        defaultValue: []
      },
      claimBonus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      promotionType: {
        type: DataTypes.ENUM(Object.values(CRM_PROMOTION_TYPE)),
        allowNull: false
      },
      scAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
      },
      gcAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
      },
      crmPromocode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      expireAt: {
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
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'crm_promotions',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  )

  CRMPromotion.associate = function (model) {
    CRMPromotion.belongsTo(model.Promocode, {
      foreignKey: 'promocode',
      targetKey: 'promocode',
      as: 'promocodeDetails'
    })
  }

  return CRMPromotion
}
