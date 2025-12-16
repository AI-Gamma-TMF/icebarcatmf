'use strict'

module.exports = (sequelize, DataTypes) => {
  const BiggestWinnersLosers = sequelize.define(
    'BiggestWinnersLosers',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      gameName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      totalWinAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      totalBetAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      totalRollbackAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      netAmount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      amountType: {
        // 0 = gc, 1 = sc, 2 = gc + sc
        type: DataTypes.INTEGER,
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
      tableName: 'biggest_winners_losers',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  BiggestWinnersLosers.associate = function (models) {
    BiggestWinnersLosers.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    BiggestWinnersLosers.hasOne(models.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId',
      sourceKey: 'gameId'
    })
  }

  return BiggestWinnersLosers
}
