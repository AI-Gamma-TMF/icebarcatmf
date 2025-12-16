'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS idx_game_id_game_data_view ON game_data_view (master_casino_game_id);'
    )
  },

  down: async (queryInterface, Sequelize) => {}
}
