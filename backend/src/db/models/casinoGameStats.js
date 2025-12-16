module.exports = function (sequelize, DataTypes) {
  const CasinoGameStats = sequelize.define(
    'CasinoGameStats',
    {
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'game_id',
        primaryKey: true
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
      },
      totalBets: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'total_bets'
      },
      totalWins: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'total_wins'
      },
      totalRounds: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'total_rounds'
      }
    },
    {
      sequelize,
      tableName: 'casino_game_stats',
      schema: 'public',
      underscored: true,
      timestamps: false
    }
  )

  CasinoGameStats.associate = function (models) {
    CasinoGameStats.belongsTo(models.MasterCasinoGame, {
      foreignKey: 'gameId',
      targetKey: 'masterCasinoGameId', // Primary key in MasterCasinoGame
      as: 'masterCasinoGame' // Alias used in queries
    })
  }

  return CasinoGameStats
}
