'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      // 1) For SC tournaments: set player_win = score (or 0 if score was NULL)
      await sequelize.query(`
        UPDATE "user_tournament" ut
        SET player_win = COALESCE(ut.score, 0)
        FROM "tournament" t
        WHERE ut.tournament_id = t.tournament_id
          AND t.entry_coin = 'SC'
      `, { transaction })

      // 2) For GC tournaments:
      //    - shift existing player_win ➔ player_bet (COALESCE to 0 if it was NULL)
      //    - set player_win = score (or 0 if score was NULL)
      await sequelize.query(`
        UPDATE "user_tournament" ut
        SET
          player_bet = COALESCE(ut.player_win, 0),
          player_win = COALESCE(ut.score, 0)
        FROM "tournament" t
        WHERE ut.tournament_id = t.tournament_id
          AND t.entry_coin = 'GC'
      `, { transaction })

      // 3) Just in case any of the three columns snuck through as NULL, force them to 0
      await sequelize.query(`
        UPDATE "user_tournament"
        SET player_win = 0
        WHERE player_win IS NULL
      `, { transaction })

      await sequelize.query(`
        UPDATE "user_tournament"
        SET player_bet = 0
        WHERE player_bet IS NULL
      `, { transaction })

      await sequelize.query(`
        UPDATE "user_tournament"
        SET player_win = 0
        WHERE player_win IS NULL
      `, { transaction })

      await transaction.commit()
      console.log('Tournament stats updated successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Error updating tournament stats:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      // Only revert the rows we touched in "up"
      // SC tournaments ➔ clear out player_win
      await sequelize.query(`
        UPDATE "user_tournament" ut
        SET player_win = NULL
        FROM "tournament" t
        WHERE ut.tournament_id = t.tournament_id
          AND t.entry_coin = 'SC'
      `, { transaction })

      // GC tournaments ➔ clear out both player_bet and player_win
      await sequelize.query(`
        UPDATE "user_tournament" ut
        SET player_bet = NULL,
            player_win = NULL
        FROM "tournament" t
        WHERE ut.tournament_id = t.tournament_id
          AND t.entry_coin = 'GC'
      `, { transaction })

      await transaction.commit()
      console.log('Tournament stats reverted successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Error reverting tournament stats:', error)
      throw error
    }
  }
}
