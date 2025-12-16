'use strict'

module.exports = (sequelize, DataTypes) => {
  const AllPackage = sequelize.define('Package', {
    packageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    // previousAmount: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: true,
    //   defaultValue: 0.0
    // },
    gcCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    scCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    // currency: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVisibleInStore: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // packageType: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    // showPackageType: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: true
    // },
    validTill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // bonusId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    // vipPoints: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    firstPurchaseApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'first_purchase_bonus_applicable'
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
    purchaseLimitPerUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    welcomePurchaseBonusApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    welcomePurchaseBonusApplicableMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    welcomePurchasePercentage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'package description'
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bonusSc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    bonusGc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    playerId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isSpecialPackage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    purchaseNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    scratchCardId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    freeSpinId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isSubscriberOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    packageTag: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'package',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: true
  })
  AllPackage.associate = function (models) {
    AllPackage.hasOne(models.Bonus, { foreignKey: 'bonusId', as: 'bonus' })
    AllPackage.hasMany(models.PackageUsers, { foreignKey: 'packageId' })
    AllPackage.hasMany(models.TransactionBanking, { foreignKey: 'packageId' })
    AllPackage.hasMany(models.PackageFirstPurchaseBonuses, { foreignKey: 'packageId', as: 'packageFirstPurchase' })
    AllPackage.hasMany(models.NonPurchasePackages, { foreignKey: 'packageId', as: 'nonPurchasePackages' })
    AllPackage.hasOne(models.ScratchCards, { foreignKey: 'scratchCardId', sourceKey: 'scratchCardId', as: 'scratchCard' })
    AllPackage.belongsTo(models.FreeSpinBonusGrant, { foreignKey: 'freeSpinId', as: 'freeSpinBonus', targetKey: 'freeSpinId' })
  }
  return AllPackage
}
