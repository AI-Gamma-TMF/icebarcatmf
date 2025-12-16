'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize

    try {
      await sequelize.query(`
        UPDATE public.tournament AS t
        SET 
          total_win = COALESCE(agg.tournamentTotalWin, 0),
          total_bet = COALESCE(agg.tournamentTotalBet, 0)
        FROM (
          SELECT 
            c.tournament_id,
            ROUND(COALESCE(SUM(CASE WHEN c.action_type = 'win' THEN c.amount ELSE 0 END)::numeric, 0), 2) AS tournamentTotalWin,
            ROUND(COALESCE(SUM(CASE WHEN c.action_type = 'bet' THEN c.amount ELSE 0 END)::numeric, 0), 2) AS tournamentTotalBet
          FROM public.casino_transactions AS c
          INNER JOIN public.tournament AS t2
            ON c.tournament_id = t2.tournament_id
          WHERE c.status = 1
            AND c.tournament_id IS NOT NULL
            AND c.amount_type = (
                CASE 
                  WHEN t2.entry_coin = 'GC' THEN 0
                  WHEN t2.entry_coin = 'SC' THEN 1
                END
            )
          GROUP BY c.tournament_id
        ) AS agg
        WHERE t.tournament_id = agg.tournament_id;
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
