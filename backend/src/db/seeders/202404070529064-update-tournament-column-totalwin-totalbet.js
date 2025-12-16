'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize

    try {
      await sequelize.query(`
        UPDATE "tournament" AS t
        SET 
          "total_win" = COALESCE(sub."tournamentTotalWin", 0),
          "total_bet" = COALESCE(sub."tournamentTotalBet", 0)
        FROM (
          SELECT 
            c."tournament_id",
            ROUND(COALESCE(SUM(CASE WHEN c."action_type" = 'win' THEN c."amount" ELSE 0 END)::numeric, 0), 2) AS "tournamentTotalWin",
            ROUND(COALESCE(SUM(CASE WHEN c."action_type" = 'bet' THEN c."amount" ELSE 0 END)::numeric, 0), 2) AS "tournamentTotalBet"
          FROM "casino_transactions" c
          WHERE c."status" = 1
          GROUP BY c."tournament_id"
        ) AS sub
        WHERE t."tournament_id" = sub."tournament_id";
      `)

      console.log('Tournament stats updated successfully!')
    } catch (error) {
      console.error('Error updating tournaments:', error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Reset totalWin and totalBet to 0
    await queryInterface.sequelize.query(`
      UPDATE "Tournaments"
      SET "totalWin" = 0, "totalBet" = 0;
    `)
  }
}
