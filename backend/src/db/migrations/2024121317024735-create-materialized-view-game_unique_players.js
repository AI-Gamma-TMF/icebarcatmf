'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW game_unique_players AS
      SELECT
          game_id::INTEGER AS game_id,
          COUNT(DISTINCT user_id) AS total_unique_players
      FROM casino_transactions
      WHERE action_type = 'bet'
      AND status = 1 AND amount_type = 1
      GROUP BY game_id
      WITH NO DATA;

      CREATE UNIQUE INDEX game_unique_players_idx ON game_unique_players (game_id);
    `)
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('DROP MATERIALIZED VIEW game_unique_players CASCADE;')
  }
}
