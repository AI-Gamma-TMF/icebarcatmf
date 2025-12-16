'use strict'
module.exports = function (sequelize, DataTypes) {
  const JackpotEntry = sequelize.define(
    'JackpotEntry',
    {
      jackpotEntryId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      jackpotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'jackpot_entries',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )
  JackpotEntry.associate = function (models) {
    JackpotEntry.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    JackpotEntry.belongsTo(models.Jackpot, {
      foreignKey: 'jackpotId'
    })
  }
  return JackpotEntry
}
