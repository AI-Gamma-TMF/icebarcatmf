'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE casino_game_stats (
        game_id INTEGER NOT NULL,
        timestamp timestamp with time zone NOT NULL,
        total_bets DOUBLE PRECISION NOT NULL DEFAULT 0,
        total_wins DOUBLE PRECISION NOT NULL DEFAULT 0,
        total_rounds DOUBLE PRECISION NOT NULL DEFAULT 0,
        PRIMARY KEY (game_id, timestamp)
    );
    `)
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('DROP TABLE casino_game_stats CASCADE;')
  }
}

// CREATE TABLE casino_game_stats (
//   game_id INTEGER NOT NULL,
//   timestamp timestamp with time zone NOT NULL,
//   total_bets DOUBLE PRECISION NOT NULL DEFAULT 0,
//   total_wins DOUBLE PRECISION NOT NULL DEFAULT 0,
//   total_rounds DOUBLE PRECISION NOT NULL DEFAULT 0,
//   PRIMARY KEY (game_id, timestamp)
// ) PARTITION BY RANGE (timestamp)
