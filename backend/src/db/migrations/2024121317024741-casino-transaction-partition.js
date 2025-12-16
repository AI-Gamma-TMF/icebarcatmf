const views = require('../views')
const config = require('../../configs/app.config')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (config.default.get('env') === 'development') {
      const transaction = await queryInterface.sequelize.transaction()
      try {
        await queryInterface.sequelize.query('DROP VIEW IF EXISTS game_unique_players;', { transaction })
        await queryInterface.sequelize.query('ALTER TABLE public.casino_transactions ALTER COLUMN game_id TYPE BIGINT USING (game_id::BIGINT);', { transaction })
        await queryInterface.sequelize.query(`
          ALTER TABLE public.casino_transactions
          DROP COLUMN wallet_id,
          DROP COLUMN currency_code,
          DROP COLUMN elastic_updated,
          DROP COLUMN is_sticky;`, { transaction }
        )
        await queryInterface.sequelize.query(views.gameUniquePlayers, { transaction })
        await queryInterface.sequelize.query('CREATE UNIQUE INDEX game_unique_players_idx ON game_unique_players (game_id);', { transaction })
      } catch (error) {
        await transaction.rollback()
        throw error
      }
      await transaction.commit()
    }
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
