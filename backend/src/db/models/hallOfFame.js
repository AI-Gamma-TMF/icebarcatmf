'use strict'

module.exports = (sequelize, DataTypes) => {
  const HallOfFameRecord = sequelize.define(
    'HallOfFameRecord',
    {
      casinoTransactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      amountType: {
        // 0 = gc, 1 = sc, 2 - gc + sc
        type: DataTypes.INTEGER,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    },
    {
      sequelize,
      tableName: 'hall_of_fame_record',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  HallOfFameRecord.associate = function (models) {
    HallOfFameRecord.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    HallOfFameRecord.hasOne(models.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId',
      sourceKey: 'gameId'
    })
  }

  return HallOfFameRecord
}
