'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserGameStats = sequelize.define(
    'UserGameStats',
    {
      userGameStatsId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'user_game_stats_id'
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        field: 'user_id'
      },
      lastSyncedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      top10Wins: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'top_10_wins'
      },
      top10GamesByBetCount: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'top_10_games_by_bet_count'
      },
      top5provider: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'top_5_provider'
      }
    },
    {
      sequelize,
      tableName: 'user_game_stats',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  UserGameStats.associate = function (models) {
    UserGameStats.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  return UserGameStats
}
