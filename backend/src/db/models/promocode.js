'use strict'

module.exports = (sequelize, DataTypes) => {
  const Promocode = sequelize.define(
    'Promocode',
    {
      promocodeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      promocode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      validTill: {
        type: DataTypes.DATE,
        allowNull: true
      },
      maxUsersAvailed: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      perUserLimit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      isDiscountOnAmount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      discountPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      package: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      userIds: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: false,
        defaultValue: []
      },
      crmPromocode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'promo_codes',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  // define association here:
  Promocode.associate = function (model) {
    Promocode.hasOne(model.CRMPromotion, {
      foreignKey: 'promocode',
      sourceKey: 'promocode',
      as: 'crmPromotion'
    })
    Promocode.hasMany(model.UserActivities, {
      foreignKey: 'promocodeId',
      sourceKey: 'promocodeId',
      as: 'userActivities'
    })
    Promocode.hasMany(model.TransactionBanking, {
      foreignKey: 'promocodeId',
      sourceKey: 'promocodeId'
    })
  }

  return Promocode
}
