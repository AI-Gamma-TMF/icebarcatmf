'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for: Casino Provider Dashboard
// FE endpoints:
// - GET /api/v1/provider-dashboard (graph + provider details table)
// - GET /api/v1/casino/aggregator (aggregator filter)
// - GET /api/v1/casino/providers (provider filter)
//
// BE service reads from:
// - master_game_aggregators, master_casino_providers, master_casino_games
// - casino_game_stats (cumulative) + casino_transactions (live)
// - game_monthly_discount (avg discount) + provider_rate (rate matrix)

module.exports = {
  async up (queryInterface) {
    try {
      const now = new Date()

      // Month boundaries for "Select Month" default (current month)
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
      const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59))

      // Match backend "latest cumulative" boundary used by Game Dashboard / Provider Dashboard.
      // This helps demo data appear immediately in summary widgets and list queries.
      const latestCumulative = new Date(now)
      latestCumulative.setUTCMinutes(latestCumulative.getUTCMinutes() - (latestCumulative.getUTCMinutes() % 30), 0, 0)
      const bufferMs = 5 * 60 * 1000
      if ((now - latestCumulative) < bufferMs) {
        latestCumulative.setUTCMinutes(latestCumulative.getUTCMinutes() - 30)
      }

      // Game Dashboard summary uses endTime = (floorTo30Min - 1 minute), with seconds 59.999
      const endTime = new Date(now)
      endTime.setUTCMinutes(Math.floor(endTime.getUTCMinutes() / 30) * 30 - 1, 59, 999)
      if (now < new Date(endTime.getTime() + 5 * 60 * 1000)) {
        endTime.setUTCMinutes(endTime.getUTCMinutes() - 30, 59, 999)
      }

      // Grab any existing user (casino_transactions.user_id is NOT NULL)
      const userRow = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM users ORDER BY user_id ASC LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )
      const demoUserId = userRow?.[0]?.userId
      if (!demoUserId) {
        // No users in DB yet; skip safely (demo-player-data seeder should create users in our demo env)
        return
      }

      // --- Ensure aggregators/providers/games exist (idempotent) ---
      const aggregators = [
        { name: 'Demo Aggregator A' },
        { name: 'Demo Aggregator B' }
      ]

      const aggregatorIdsByName = {}
      for (const a of aggregators) {
        const existingAgg = await queryInterface.sequelize.query(
          `SELECT master_game_aggregator_id AS "id"
           FROM master_game_aggregators
           WHERE name = :name
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { name: a.name } }
        )

        if (existingAgg?.[0]?.id) {
          aggregatorIdsByName[a.name] = existingAgg[0].id
          continue
        }

        const [insertedAgg] = await queryInterface.bulkInsert(
          'master_game_aggregators',
          [
            {
              name: a.name,
              is_active: true,
              is_hidden: false,
              created_at: now,
              updated_at: now
            }
          ],
          { returning: ['master_game_aggregator_id'] }
        )

        // Some dialects don't return rows; fetch again by name
        const aggIdRow = await queryInterface.sequelize.query(
          `SELECT master_game_aggregator_id AS "id"
           FROM master_game_aggregators
           WHERE name = :name
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { name: a.name } }
        )
        aggregatorIdsByName[a.name] = aggIdRow?.[0]?.id
      }

      const providers = [
        { name: 'Demo Provider Alpha', aggregatorName: 'Demo Aggregator A' },
        { name: 'Demo Provider Beta', aggregatorName: 'Demo Aggregator A' },
        { name: 'Demo Provider Gamma', aggregatorName: 'Demo Aggregator B' }
      ]

      const providerIdsByName = {}
      for (const p of providers) {
        const existingProv = await queryInterface.sequelize.query(
          `SELECT master_casino_provider_id AS "id"
           FROM master_casino_providers
           WHERE name = :name
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { name: p.name } }
        )
        if (existingProv?.[0]?.id) {
          providerIdsByName[p.name] = existingProv[0].id
          continue
        }

        await queryInterface.bulkInsert(
          'master_casino_providers',
          [
            {
              name: p.name,
              is_active: true,
              is_hidden: false,
              master_game_aggregator_id: aggregatorIdsByName[p.aggregatorName] || null,
              created_at: now,
              updated_at: now
            }
          ],
          {}
        )

        const provIdRow = await queryInterface.sequelize.query(
          `SELECT master_casino_provider_id AS "id"
           FROM master_casino_providers
           WHERE name = :name
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { name: p.name } }
        )
        providerIdsByName[p.name] = provIdRow?.[0]?.id
      }

      // Create a few games per provider with stable identifiers
      const games = [
        { providerName: 'Demo Provider Alpha', name: 'Demo Slots Alpha 1', identifier: 'demo_slots_alpha_1', rtp: 96.2 },
        { providerName: 'Demo Provider Alpha', name: 'Demo Slots Alpha 2', identifier: 'demo_slots_alpha_2', rtp: 95.6 },
        { providerName: 'Demo Provider Beta', name: 'Demo Roulette Beta', identifier: 'demo_roulette_beta', rtp: 97.1 },
        { providerName: 'Demo Provider Gamma', name: 'Demo Blackjack Gamma', identifier: 'demo_blackjack_gamma', rtp: 94.8 }
      ]

      const gameIdsByIdentifier = {}
      for (const g of games) {
        const existingGame = await queryInterface.sequelize.query(
          `SELECT master_casino_game_id AS "id"
           FROM master_casino_games
           WHERE identifier = :identifier
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { identifier: g.identifier } }
        )
        if (existingGame?.[0]?.id) {
          gameIdsByIdentifier[g.identifier] = existingGame[0].id
          continue
        }

        await queryInterface.bulkInsert(
          'master_casino_games',
          [
            {
              name: g.name,
              identifier: g.identifier,
              master_casino_provider_id: providerIdsByName[g.providerName] || null,
              is_active: true,
              is_hidden: false,
              // Required NOT NULL column in prod/demo DB schema
              is_demo_supported: true,
              return_to_player: g.rtp,
              created_at: now,
              updated_at: now
            }
          ],
          {}
        )

        const gameIdRow = await queryInterface.sequelize.query(
          `SELECT master_casino_game_id AS "id"
           FROM master_casino_games
           WHERE identifier = :identifier
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { identifier: g.identifier } }
        )
        gameIdsByIdentifier[g.identifier] = gameIdRow?.[0]?.id
      }

      const demoGameIds = Object.values(gameIdsByIdentifier).filter(Boolean)
      if (demoGameIds.length === 0) {
        return
      }

      const idsSql = demoGameIds.join(', ')

      // --- Refresh month-scoped demo stats/transactions/discounts (safe + idempotent) ---
      await queryInterface.sequelize.query(
        `DELETE FROM casino_game_stats
         WHERE game_id IN (${idsSql})
           AND timestamp BETWEEN :start AND :end;`,
        { replacements: { start: monthStart.toISOString(), end: monthEnd.toISOString() } }
      )

      // Also clear any "recent" demo rows (last 35 minutes) to keep the live widgets deterministic.
      await queryInterface.sequelize.query(
        `DELETE FROM casino_game_stats
         WHERE game_id IN (${idsSql})
           AND timestamp > (NOW() - INTERVAL '35 minutes');`,
        {}
      )

      await queryInterface.sequelize.query(
        `DELETE FROM casino_transactions
         WHERE game_id IN (${demoGameIds.map(id => `'${id}'`).join(', ')})
           AND transaction_id LIKE 'demo-provider-%'
           AND created_at BETWEEN :start AND :end;`,
        { replacements: { start: monthStart.toISOString(), end: monthEnd.toISOString() } }
      )

      await queryInterface.sequelize.query(
        `DELETE FROM game_monthly_discount
         WHERE master_casino_game_id IN (${idsSql})
           AND start_month_date = :startMonthDate
           AND end_month_date = :endMonthDate;`,
        {
          replacements: {
            startMonthDate: monthStart.toISOString(),
            endMonthDate: monthEnd.toISOString()
          }
        }
      )

      // Insert monthly discounts (gives non-zero avg discount %)
      const discounts = demoGameIds.map((gameId, idx) => ({
        master_casino_game_id: gameId,
        start_month_date: monthStart,
        end_month_date: monthEnd,
        discount_percentage: (idx % 3 === 0 ? 6 : idx % 3 === 1 ? 4 : 2),
        created_at: now,
        updated_at: now
      }))
      await queryInterface.bulkInsert('game_monthly_discount', discounts, {})

      // Insert provider rate matrix rows (if missing)
      for (const p of providers) {
        const providerId = providerIdsByName[p.name]
        const aggregatorId = aggregatorIdsByName[p.aggregatorName]
        if (!providerId || !aggregatorId) continue

        const existingRate = await queryInterface.sequelize.query(
          `SELECT rate_id AS "rateId"
           FROM provider_rate
           WHERE provider_id = :providerId
             AND aggregator_id = :aggregatorId
             AND ggr_minimum = 0
             AND ggr_maximum IS NULL
             AND deleted_at IS NULL
           LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { providerId, aggregatorId } }
        )

        if (existingRate?.[0]?.rateId) continue

        await queryInterface.bulkInsert(
          'provider_rate',
          [
            {
              provider_id: providerId,
              aggregator_id: aggregatorId,
              ggr_minimum: 0,
              ggr_maximum: null,
              rate: p.name === 'Demo Provider Alpha' ? 8 : p.name === 'Demo Provider Beta' ? 10 : 7,
              created_at: now,
              updated_at: now
            }
          ],
          {}
        )
      }

      // Insert game stats for the last ~10 days within current month
      const statsRows = []
      const dayCount = 10
      for (let d = 0; d < dayCount; d++) {
        const ts = new Date(now)
        ts.setUTCDate(now.getUTCDate() - d)
        ts.setUTCHours(0, 10, 0, 0)

        // Ensure within month
        if (ts < monthStart || ts > monthEnd) continue

        for (const gameId of demoGameIds) {
          const seed = (gameId * 13 + d * 7) % 100
          const totalBets = 500 + seed * 12 + d * 20
          const totalWins = totalBets * (0.88 + (seed % 7) / 100) // ~88–94% RTP
          statsRows.push({
            game_id: gameId,
            timestamp: ts,
            total_bets: Number(totalBets.toFixed(2)),
            total_wins: Number(totalWins.toFixed(2)),
            total_rounds: 100 + seed + d * 3
          })
        }
      }

      // Add a "recent" stats row for liveTopGames (timestamp > now - 30 minutes)
      // and also a row <= latestCumulative/endTime so summary widgets show non-zero totals.
      const recentTs = new Date(now.getTime() - 10 * 60 * 1000)
      if (recentTs >= monthStart && recentTs <= monthEnd) {
        for (const gameId of demoGameIds) {
          const seed = (gameId * 19) % 100
          const totalBets = 120 + seed * 2
          const totalWins = totalBets * (0.82 + (seed % 9) / 100)
          statsRows.push({
            game_id: gameId,
            timestamp: recentTs,
            total_bets: Number(totalBets.toFixed(2)),
            total_wins: Number(totalWins.toFixed(2)),
            total_rounds: 30 + (seed % 20)
          })
        }
      }

      const cumulativeTs = new Date(Math.min(latestCumulative.getTime(), endTime.getTime()) - 60 * 1000)
      if (cumulativeTs >= monthStart && cumulativeTs <= monthEnd) {
        for (const gameId of demoGameIds) {
          const seed = (gameId * 23) % 100
          const totalBets = 200 + seed
          const totalWins = totalBets * (0.86 + (seed % 5) / 100)
          statsRows.push({
            game_id: gameId,
            timestamp: cumulativeTs,
            total_bets: Number(totalBets.toFixed(2)),
            total_wins: Number(totalWins.toFixed(2)),
            total_rounds: 40 + (seed % 25)
          })
        }
      }

      if (statsRows.length > 0) {
        await queryInterface.bulkInsert('casino_game_stats', statsRows, {})
      }

      // Insert a few "live" casino transactions within current month for each game
      const txRows = []
      for (const gameId of demoGameIds) {
        const base = (gameId * 17) % 50
        const betAmount = 5 + base / 10
        const winAmount = betAmount * (0.75 + (base % 10) / 20)
        const ts = new Date(now)
        ts.setUTCMinutes(ts.getUTCMinutes() - (base % 30))

        txRows.push({
          user_id: demoUserId,
          game_id: String(gameId),
          game_identifier: games.find(g => gameIdsByIdentifier[g.identifier] === gameId)?.identifier || null,
          action_type: 'bet',
          action_id: '0',
          amount: Number(betAmount.toFixed(2)),
          status: 1,
          amount_type: 1,
          transaction_id: `demo-provider-${now.getTime()}-${gameId}-bet`,
          round_id: `demo-round-${now.getTime()}-${gameId}`,
          created_at: ts,
          updated_at: ts
        })
        txRows.push({
          user_id: demoUserId,
          game_id: String(gameId),
          game_identifier: games.find(g => gameIdsByIdentifier[g.identifier] === gameId)?.identifier || null,
          action_type: 'win',
          action_id: '1',
          amount: Number(winAmount.toFixed(2)),
          status: 1,
          amount_type: 1,
          transaction_id: `demo-provider-${now.getTime()}-${gameId}-win`,
          round_id: `demo-round-${now.getTime()}-${gameId}`,
          created_at: ts,
          updated_at: ts
        })
      }
      if (txRows.length > 0) {
        await queryInterface.bulkInsert('casino_transactions', txRows, {})
      }
    } catch (err) {
      throw err
    }
  },

  async down (queryInterface) {
    try {
      // Only remove the explicit demo-named rows, keep real data intact.
      const providerNames = ['Demo Provider Alpha', 'Demo Provider Beta', 'Demo Provider Gamma']
      const aggregatorNames = ['Demo Aggregator A', 'Demo Aggregator B']
      const gameIdentifiers = ['demo_slots_alpha_1', 'demo_slots_alpha_2', 'demo_roulette_beta', 'demo_blackjack_gamma']

      const providers = await queryInterface.sequelize.query(
        `SELECT master_casino_provider_id AS "id" FROM master_casino_providers WHERE name IN (:names);`,
        { type: QueryTypes.SELECT, replacements: { names: providerNames } }
      )
      const providerIds = providers.map(r => r.id).filter(Boolean)

      const games = await queryInterface.sequelize.query(
        `SELECT master_casino_game_id AS "id" FROM master_casino_games WHERE identifier IN (:ids);`,
        { type: QueryTypes.SELECT, replacements: { ids: gameIdentifiers } }
      )
      const gameIds = games.map(r => r.id).filter(Boolean)

      if (gameIds.length > 0) {
        const idsSql = gameIds.join(', ')
        await queryInterface.sequelize.query(`DELETE FROM casino_game_stats WHERE game_id IN (${idsSql});`, {})
        await queryInterface.sequelize.query(`DELETE FROM game_monthly_discount WHERE master_casino_game_id IN (${idsSql});`, {})
        await queryInterface.sequelize.query(
          `DELETE FROM casino_transactions WHERE game_id IN (${gameIds.map(id => `'${id}'`).join(', ')}) AND transaction_id LIKE 'demo-provider-%';`,
          {}
        )
        await queryInterface.sequelize.query(`DELETE FROM master_casino_games WHERE master_casino_game_id IN (${idsSql});`, {})
      }

      if (providerIds.length > 0) {
        const idsSql = providerIds.join(', ')
        await queryInterface.sequelize.query(`DELETE FROM provider_rate WHERE provider_id IN (${idsSql});`, {})
        await queryInterface.sequelize.query(`DELETE FROM master_casino_providers WHERE master_casino_provider_id IN (${idsSql});`, {})
      }

      await queryInterface.sequelize.query(
        `DELETE FROM master_game_aggregators WHERE name IN (:names);`,
        { replacements: { names: aggregatorNames } }
      )
    } catch (err) {
      throw err
    }
  }
}

