import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { sequelize } from '../../db/models'
import { Op, QueryTypes } from 'sequelize'

export class GetGameDashboard extends ServiceBase {
  async run () {
    const {
      dbModels: {
        UserReports: UserReportsModel
      }
    } = this.context

    const now = new Date()

    const endTime = new Date(now)
    endTime.setMinutes(Math.floor(endTime.getMinutes() / 30) * 30 - 1)
    endTime.setSeconds(59)
    endTime.setMilliseconds(999)

    // Add 5 minute buffer
    const bufferTime = new Date(endTime.getTime() + 5 * 60 * 1000)

    // If current time is less than bufferTime, shift back  to 30 more minutes
    if (now < bufferTime) {
      endTime.setMinutes(endTime.getMinutes() - 30)
      endTime.setSeconds(59)
      endTime.setMilliseconds(999)
    }

    const gameReportQuery = `
      SELECT 
        ROUND(SUM(total_bets)::NUMERIC, 2) AS "totalBet",
        ROUND(SUM(total_wins)::NUMERIC, 2) AS "totalWin",
        ROUND((SUM(total_wins)::NUMERIC * 100) / NULLIF(SUM(total_bets)::NUMERIC, 0), 2) AS "totalRTP",
        (SUM(total_bets)::NUMERIC - SUM(total_wins)::NUMERIC) AS "totalGGR"
      FROM (
       SELECT 
          COALESCE(SUM(total_bets), 0) AS total_bets,
          COALESCE(SUM(total_wins), 0) AS total_wins
        FROM casino_game_stats 
        WHERE timestamp <= :endTime

        UNION ALL

        SELECT 
          COALESCE(SUM(CASE WHEN action_type = 'bet' THEN amount ELSE 0 END), 0) AS total_bets,
          COALESCE(SUM(CASE WHEN action_type = 'win' THEN amount ELSE 0 END), 0) AS total_wins
        FROM casino_transactions
        WHERE created_at > :endTime
          AND status = 1
          AND amount_type = 1
          AND action_type IN ('bet', 'win')
      ) AS combined;
    `

    const liveTopGamesQuery = `
      WITH ranked_games AS (
        SELECT 
            cgs.game_id, 
            mcg.name, 
            ROUND((cgs.total_bets - cgs.total_wins)::numeric, 2) AS ggr_change,
            RANK() OVER (ORDER BY (cgs.total_bets - cgs.total_wins) DESC) AS top_rank,
            RANK() OVER (ORDER BY (cgs.total_bets - cgs.total_wins) ASC) AS bottom_rank
        FROM 
            casino_game_stats cgs
        LEFT JOIN 
            master_casino_games mcg 
            ON cgs.game_id = mcg.master_casino_game_id
        WHERE 
            cgs.timestamp > NOW() - INTERVAL '30 minutes'
      )
      SELECT game_id, name, ggr_change, 'top' AS category
      FROM ranked_games
      WHERE top_rank <= 3
      UNION ALL
      SELECT game_id, name, ggr_change, 'bottom' AS category
      FROM ranked_games
      WHERE bottom_rank <= 3
      ORDER BY ggr_change DESC;
    `

    try {
      const [
        gameReportResult,
        totalPlayers,
        liveTopGames
      ] = await Promise.all([
        sequelize.query(gameReportQuery, { type: QueryTypes.SELECT, replacements: { endTime } }),
        UserReportsModel.count({
          where: { total_sc_bet_amount: { [Op.gt]: 0 } }
        }),
        sequelize.query(liveTopGamesQuery, { type: QueryTypes.SELECT })
      ])

      const gameReportData = gameReportResult[0] || {}

      return {
        status: 200,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: {
          ...gameReportData,
          totalPlayers: totalPlayers ?? 0,
          liveTopGames: liveTopGames ?? []
        }
      }
    } catch (error) {
      console.error('Error fetching game dashboard data:', error)
      return this.addError('InternalServerErrorType', 'Something went wrong, please try again later.')
    }
  }
}
