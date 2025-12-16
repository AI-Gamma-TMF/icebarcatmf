'use strict'

module.exports = (sequelize, DataTypes) => {
  const RafflesEntry = sequelize.define(
    'RafflesEntry',
    {
      entryId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      raffleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isWinner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      scWin: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      gcWin: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'raffles_entry',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // Define association here
  RafflesEntry.associate = function (models) {
    RafflesEntry.belongsTo(models.Raffles, { foreignKey: 'raffleId' })
    RafflesEntry.belongsTo(models.User, { foreignKey: 'userId' })
  }

  return RafflesEntry
}
