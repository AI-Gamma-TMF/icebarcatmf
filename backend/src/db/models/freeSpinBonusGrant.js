'use strict'
module.exports = (sequelize, DataTypes) => {
  const FreeSpinBonusGrant = sequelize.define(
    'FreeSpinBonusGrant',
    {
      freeSpinId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      masterCasinoGameId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      freeSpinAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      freeSpinRound: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      coinType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'SC',
        comment: 'SC & GC'
      },
      isNotifyUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      freeSpinType: {
        type: DataTypes.STRING,
        defaultValue: 'directGrant',
        comment: 'direct-grant, daily-bonus, packages'
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      daysValidity: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'free_spin_bonus_grant',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  FreeSpinBonusGrant.associate = function (models) {
    FreeSpinBonusGrant.hasMany(models.UserBonus, {
      foreignKey: 'freeSpinId',
      onDelete: 'cascade'
    })

    FreeSpinBonusGrant.belongsTo(models.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId',
      as: 'masterCasinoGame'
    })
  }

  return FreeSpinBonusGrant
}
