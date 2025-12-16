'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS user_tournament_tournament_id_user_id_idx
      ON user_tournament (tournament_id DESC, user_id);
    `)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS user_tournament_tournament_id_user_id_idx;
    `)
  }
}
