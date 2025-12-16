'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterCasinoGame = sequelize.define('MasterCasinoGame', {
    masterCasinoGameId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    masterCasinoProviderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isDemoSupported: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    demoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand: {
      allowNull: true,
      type: DataTypes.STRING
    },
    brandId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasFreespins: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    freeSpinBetScaleAmount: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    featureGroup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    devices: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    lines: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    returnToPlayer: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    wageringContribution: {
      type: DataTypes.DOUBLE,
      defaultValue: 100
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    operatorStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    adminEnabledFreespin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'master_casino_games',
    schema: 'public',
    timestamps: true,
    underscored: true

  })

  MasterCasinoGame.associate = function (models) {
    MasterCasinoGame.belongsTo(models.MasterCasinoProvider, {
      foreignKey: 'masterCasinoProviderId',
      as: 'masterCasinoProvider'
    })
    MasterCasinoGame.hasMany(models.GameSubCategory, {
      foreignKey: 'masterCasinoGameId'
    })
    MasterCasinoGame.hasMany(models.CasinoGameStats, {
      foreignKey: 'gameId',
      sourceKey: 'masterCasinoGameId', // Primary key in MasterCasinoGame
      as: 'casinoGameStats'
    })
    MasterCasinoGame.hasMany(models.Jackpot, {
      foreignKey: 'gameId',
      sourceKey: 'masterCasinoGameId'
    })
  }

  return MasterCasinoGame
}
