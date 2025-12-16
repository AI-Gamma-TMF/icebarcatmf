'use strict'
module.exports = function (sequelize, DataTypes) {
  const Jackpot = sequelize.define(
    'Jackpot',
    {
      jackpotId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      jackpotName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      maxTicketSize: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seedAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      jackpotPoolAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      jackpotPoolEarning: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      entryAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      adminShare: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      poolShare: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      winningTicket: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0: Upcoming, 1: Active, 2: Closed'
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      ticketSold: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        columnName: 'ticket_sold'
      }
    },
    {
      sequelize,
      tableName: 'jackpots',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )
  Jackpot.associate = function (models) {
    Jackpot.hasMany(models.JackpotEntry, {
      foreignKey: 'jackpotId'
    })
    Jackpot.belongsTo(models.MasterCasinoGame, {
      foreignKey: 'gameId',
      targetKey: 'masterCasinoGameId'
    })
  }
  return Jackpot
}
