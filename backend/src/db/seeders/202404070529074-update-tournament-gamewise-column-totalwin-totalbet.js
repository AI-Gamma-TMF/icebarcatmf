'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const sequelize = queryInterface.sequelize

    // const transaction = await queryInterface.sequelize.transaction()
    // try {
    //   await sequelize.query(`
    //     WITH game_sums AS (
    //       SELECT
    //         c.tournament_id,
    //         c.game_id,
    //         ROUND(SUM(CASE WHEN c.action_type = 'bet' THEN c.amount ELSE 0 END)::numeric, 2) AS total_bet,
    //         ROUND(SUM(CASE WHEN c.action_type = 'win' THEN c.amount ELSE 0 END)::numeric, 2) AS total_win
    //       FROM public.casino_transactions c
    //       INNER JOIN public.tournament AS t2
    //           ON c.tournament_id = t2.tournament_id
    //         WHERE c.status = 1
    //           AND c.tournament_id IS NOT NULL
    //           AND c.game_id IS NOT NULL
    //           AND c.amount_type = (
    //               CASE
    //                 WHEN t2.entry_coin = 'GC' THEN 0
    //                 WHEN t2.entry_coin = 'SC' THEN 1
    //               END
    //           )
    //         GROUP BY c.tournament_id, c.game_id
    //     )
    //     UPDATE public.tournament t
    //     SET game_bet_win_stats = per_t.stats_map
    //     FROM (
    //       SELECT
    //         t_inner.tournament_id,
    //         JSONB_OBJECT_AGG(
    //           gid_text,
    //           JSONB_BUILD_OBJECT(
    //             'totalBet', COALESCE(gs.total_bet, 0),
    //             'totalWin', COALESCE(gs.total_win, 0)
    //           )
    //         ) AS stats_map
    //       FROM public.tournament AS t_inner
    //       CROSS JOIN LATERAL UNNEST(t_inner.game_id) AS gid
    //       CROSS JOIN LATERAL (SELECT gid::text AS gid_text) AS _gid
    //       LEFT JOIN game_sums gs
    //         ON gs.tournament_id = t_inner.tournament_id
    //        AND gs.game_id::text = gid_text
    //       GROUP BY t_inner.tournament_id
    //     ) AS per_t
    //     WHERE per_t.tournament_id = t.tournament_id;
    //   `, { transaction })
    //   await transaction.commit()
    // } catch (error) {
    //   await transaction.rollback()
    //   console.log('Error while running update tournament seeder', error)
    //   throw error
    // }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE public.tournament
      SET game_bet_win_stats = NULL;
    `)
  }

}
