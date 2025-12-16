'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserGameplayHistory = sequelize.define(
    'UserGameplayHistory',
    {
      id: {
        autoIncrement: true,
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
        allowNull: false
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      sessionToken: {
        type: DataTypes.STRING,
        allowNull: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'user_gameplay_history',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  UserGameplayHistory.associate = function (model) {}

  return UserGameplayHistory
}
