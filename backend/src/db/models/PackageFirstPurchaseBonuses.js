'use strict'

module.exports = (sequelize, DataTypes) => {
  const PackageFirstPurchaseBonuses = sequelize.define('PackageFirstPurchaseBonuses', {
    packageFirstPurchaseId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'package_first_purchase_id'
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    firstPurchaseScBonus: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    },
    firstPurchaseGcBonus: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'package_first_purchase_bonuses',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  PackageFirstPurchaseBonuses.associate = function (models) {
    PackageFirstPurchaseBonuses.belongsTo(models.Package, {
      foreignKey: 'packageId'
    })
  }
  return PackageFirstPurchaseBonuses
}
