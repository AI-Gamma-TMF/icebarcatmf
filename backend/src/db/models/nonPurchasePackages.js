'use strict'

module.exports = (sequelize, DataTypes) => {
  const NonPurchasePackages = sequelize.define('NonPurchasePackages', {
    nonPurchasePackageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'package',
        key: 'package_id'
      }
    },
    intervalDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discountedAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    bonusPercentage: {
      type: DataTypes.INTEGER,
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
    scBonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gcBonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    noOfPurchases: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastPurchased: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'non_purchase_packages',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: true
  })

  NonPurchasePackages.associate = function (models) {
    NonPurchasePackages.belongsTo(models.Package, {
      foreignKey: 'packageId',
      constraints: false,
      as: 'package',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
    NonPurchasePackages.hasMany(models.User, {
      foreignKey: 'nonPurchasePackageId'
    })
    NonPurchasePackages.hasMany(models.TransactionBanking, {
      foreignKey: 'subPackageId'
    })
  }

  return NonPurchasePackages
}
