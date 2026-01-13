'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for Casino Management sections:
// - Game Lobby (GET /api/v1/game-pages/game-lobby) -> depends on game_data_view (materialized)
// - Aggregators (GET /api/v1/casino/aggregator) -> master_game_aggregators
// - Providers (GET /api/v1/casino/providers) -> master_casino_providers
// - Sub Categories (GET /api/v1/casino/subcategory) -> master_game_sub_categories
// - Games (GET /api/v1/casino/games and /api/v1/casino/game) -> master_casino_games + game_subcategory
// - Game Free Spin (GET /api/v1/casino/free-spin/free-spin-grant + /dashboard) -> free_spin_bonus_grant + user_bonus
// - Scratch Card (GET /api/v1/bonus/scratch-card + graph) -> scratch_cards + scratch_card_configuration + scratch_card_budget_usage + user_bonus (+ optional casino_transactions)
// - Jackpot (GET /api/v1/jackpot + /current + /graph) -> jackpots (+ optional casino_transactions)
//
// IMPORTANT:
// - game_data_view refresh uses REFRESH MATERIALIZED VIEW CONCURRENTLY via triggers. Do NOT use an explicit transaction here.
// - This seeder is idempotent: it upserts by stable "demo" names/identifiers.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // Pick any existing user for user_bonus / casino_transactions
    const userRow = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId" FROM users ORDER BY user_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    const demoUserId = userRow?.[0]?.userId
    if (!demoUserId) return

    // --- Load existing demo provider dashboard seed entities (created by 20260113093000...) ---
    const demoAggregators = ['Demo Aggregator A', 'Demo Aggregator B']
    const demoProviders = ['Demo Provider Alpha', 'Demo Provider Beta', 'Demo Provider Gamma']
    const demoGameIdentifiers = ['demo_slots_alpha_1', 'demo_slots_alpha_2', 'demo_roulette_beta', 'demo_blackjack_gamma']

    const aggregators = await queryInterface.sequelize.query(
      `SELECT master_game_aggregator_id AS "id", name
       FROM master_game_aggregators
       WHERE name IN (:names);`,
      { type: QueryTypes.SELECT, replacements: { names: demoAggregators } }
    )
    const aggregatorIdsByName = Object.fromEntries(aggregators.map(a => [a.name, a.id]))

    const providers = await queryInterface.sequelize.query(
      `SELECT master_casino_provider_id AS "id", name, master_game_aggregator_id AS "aggregatorId"
       FROM master_casino_providers
       WHERE name IN (:names);`,
      { type: QueryTypes.SELECT, replacements: { names: demoProviders } }
    )
    const providerIdsByName = Object.fromEntries(providers.map(p => [p.name, p.id]))

    const games = await queryInterface.sequelize.query(
      `SELECT master_casino_game_id AS "id", identifier, master_casino_provider_id AS "providerId"
       FROM master_casino_games
       WHERE identifier IN (:ids);`,
      { type: QueryTypes.SELECT, replacements: { ids: demoGameIdentifiers } }
    )
    const gameIdsByIdentifier = Object.fromEntries(games.map(g => [g.identifier, g.id]))

    // If base demo provider/game data isn't present yet, skip (the other seeder should run first).
    if (!Object.values(providerIdsByName).length || !Object.values(gameIdsByIdentifier).length) return

    // Ensure aggregator/provider free spin flags + ordering are set (these are shown in UI columns/actions).
    await queryInterface.sequelize.query(
      `UPDATE master_game_aggregators
       SET free_spin_allowed = COALESCE(free_spin_allowed, true),
           admin_enabled_freespin = COALESCE(admin_enabled_freespin, true),
           updated_at = :now
       WHERE name IN (:names);`,
      { replacements: { now, names: demoAggregators } }
    )

    await queryInterface.sequelize.query(
      `UPDATE master_casino_providers
       SET free_spin_allowed = COALESCE(free_spin_allowed, true),
           admin_enabled_freespin = COALESCE(admin_enabled_freespin, true),
           order_id = COALESCE(order_id, 1),
           thumbnail_url = COALESCE(thumbnail_url, 'https://dummyimage.com/80x80/222/00ffcc.png&text=PROV'),
           updated_at = :now
       WHERE name IN (:names);`,
      { replacements: { now, names: demoProviders } }
    )

    // Ensure demo games are active + have thumbnails (Games table shows ImageViewer + Active on site)
    await queryInterface.sequelize.query(
      `UPDATE master_casino_games
       SET is_active = true,
           is_hidden = false,
           has_freespins = COALESCE(has_freespins, true),
           admin_enabled_freespin = COALESCE(admin_enabled_freespin, true),
           image_url = COALESCE(image_url, 'https://dummyimage.com/320x180/111/00ffcc.png&text=GAME'),
           updated_at = :now
       WHERE identifier IN (:ids);`,
      { replacements: { now, ids: demoGameIdentifiers } }
    )

    // --- Subcategories + game_subcategory mapping (powers Game Lobby + Sub Categories + game_data_view) ---
    const demoSubCats = [
      { slug: 'demo-slots', nameEN: 'Demo Slots', orderId: 1, isFeatured: true },
      { slug: 'demo-table', nameEN: 'Demo Table Games', orderId: 2, isFeatured: false },
      { slug: 'demo-new', nameEN: 'Demo New Releases', orderId: 3, isFeatured: false }
    ]

    const subCatIdsBySlug = {}
    for (const sc of demoSubCats) {
      const existing = await queryInterface.sequelize.query(
        `SELECT master_game_sub_category_id AS "id"
         FROM master_game_sub_categories
         WHERE slug = :slug
         LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { slug: sc.slug } }
      )
      if (existing?.[0]?.id) {
        subCatIdsBySlug[sc.slug] = existing[0].id
        continue
      }

      await queryInterface.bulkInsert('master_game_sub_categories', [{
        name: JSON.stringify({ EN: sc.nameEN }),
        image_url: JSON.stringify({
          thumbnail: `https://dummyimage.com/240x140/0b0b0b/00ffcc.png&text=${encodeURIComponent(sc.nameEN)}`,
          selectedThumbnail: `https://dummyimage.com/240x140/141414/00ffcc.png&text=${encodeURIComponent(sc.nameEN)}`
        }),
        is_active: true,
        order_id: sc.orderId,
        is_featured: sc.isFeatured,
        slug: sc.slug,
        created_at: now,
        updated_at: now
      }], {})

      const inserted = await queryInterface.sequelize.query(
        `SELECT master_game_sub_category_id AS "id"
         FROM master_game_sub_categories
         WHERE slug = :slug
         LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { slug: sc.slug } }
      )
      subCatIdsBySlug[sc.slug] = inserted?.[0]?.id
    }

    // Create deterministic mapping: first two games -> slots, roulette -> table, blackjack -> new
    const mappings = [
      { gameIdentifier: 'demo_slots_alpha_1', subSlug: 'demo-slots', orderId: 1 },
      { gameIdentifier: 'demo_slots_alpha_2', subSlug: 'demo-slots', orderId: 2 },
      { gameIdentifier: 'demo_roulette_beta', subSlug: 'demo-table', orderId: 1 },
      { gameIdentifier: 'demo_blackjack_gamma', subSlug: 'demo-new', orderId: 1 }
    ]

    for (const m of mappings) {
      const gameId = gameIdsByIdentifier[m.gameIdentifier]
      const subId = subCatIdsBySlug[m.subSlug]
      if (!gameId || !subId) continue

      const existing = await queryInterface.sequelize.query(
        `SELECT game_subcategory_id AS "id"
         FROM game_subcategory
         WHERE master_casino_game_id = :gameId
           AND master_game_sub_category_id = :subId
         LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { gameId, subId } }
      )
      if (existing?.[0]?.id) {
        await queryInterface.sequelize.query(
          `UPDATE game_subcategory SET order_id = :orderId, updated_at = :now WHERE game_subcategory_id = :id;`,
          { replacements: { orderId: m.orderId, now, id: existing[0].id } }
        )
        continue
      }

      await queryInterface.bulkInsert('game_subcategory', [{
        master_casino_game_id: gameId,
        master_game_sub_category_id: subId,
        order_id: m.orderId,
        created_at: now,
        updated_at: now
      }], {})
    }

    // --- Free Spin (list + dashboard tiles) ---
    // Ensure free-spin bonus exists
    let freeSpinBonus = await queryInterface.sequelize.query(
      `SELECT bonus_id AS "bonusId" FROM bonus WHERE bonus_type = 'free-spin-bonus' AND deleted_at IS NULL ORDER BY bonus_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    let freeSpinBonusId = freeSpinBonus?.[0]?.bonusId
    if (!freeSpinBonusId) {
      await queryInterface.bulkInsert('bonus', [{
        parent_type: 'admin',
        parent_id: 1,
        valid_from: now,
        bonus_type: 'free-spin-bonus',
        currency: JSON.stringify({}),
        is_active: false,
        bonus_name: 'Free Spin Bonus',
        description: JSON.stringify({}),
        created_at: now,
        updated_at: now
      }], {})
      freeSpinBonus = await queryInterface.sequelize.query(
        `SELECT bonus_id AS "bonusId" FROM bonus WHERE bonus_type = 'free-spin-bonus' AND deleted_at IS NULL ORDER BY bonus_id ASC LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )
      freeSpinBonusId = freeSpinBonus?.[0]?.bonusId
    }

    const freeSpinSeeds = [
      {
        title: 'Demo Free Spin Ongoing',
        providerName: 'Demo Provider Alpha',
        gameIdentifier: 'demo_slots_alpha_1',
        coinType: 'SC',
        freeSpinType: 'directGrant',
        status: 1,
        freeSpinAmount: 0.5,
        freeSpinRound: 20,
        startDate: new Date(now.getTime() - 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 3 * 60 * 60 * 1000)
      },
      {
        title: 'Demo Free Spin Upcoming',
        providerName: 'Demo Provider Beta',
        gameIdentifier: 'demo_roulette_beta',
        coinType: 'GC',
        freeSpinType: 'directGrant',
        status: 0,
        freeSpinAmount: 1,
        freeSpinRound: 10,
        startDate: new Date(now.getTime() + 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 6 * 60 * 60 * 1000)
      },
      {
        title: 'Demo Free Spin Completed',
        providerName: 'Demo Provider Gamma',
        gameIdentifier: 'demo_blackjack_gamma',
        coinType: 'SC',
        freeSpinType: 'attachedGrant',
        status: 2,
        freeSpinAmount: 0.25,
        freeSpinRound: 40,
        startDate: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      }
    ]

    const freeSpinIdsByTitle = {}
    for (const fs of freeSpinSeeds) {
      const providerId = providerIdsByName[fs.providerName]
      const gameId = gameIdsByIdentifier[fs.gameIdentifier]
      if (!providerId || !gameId) continue

      const existing = await queryInterface.sequelize.query(
        `SELECT free_spin_id AS "id" FROM free_spin_bonus_grant WHERE title = :title LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { title: fs.title } }
      )
      if (existing?.[0]?.id) {
        freeSpinIdsByTitle[fs.title] = existing[0].id
        continue
      }

      await queryInterface.bulkInsert('free_spin_bonus_grant', [{
        title: fs.title,
        provider_id: providerId,
        master_casino_game_id: gameId,
        free_spin_amount: fs.freeSpinAmount,
        free_spin_round: fs.freeSpinRound,
        start_date: fs.startDate,
        end_date: fs.endDate,
        coin_type: fs.coinType,
        free_spin_type: fs.freeSpinType,
        status: fs.status,
        is_notify_user: false,
        created_at: now,
        updated_at: now
      }], {})

      const inserted = await queryInterface.sequelize.query(
        `SELECT free_spin_id AS "id" FROM free_spin_bonus_grant WHERE title = :title LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { title: fs.title } }
      )
      freeSpinIdsByTitle[fs.title] = inserted?.[0]?.id
    }

    // Seed user_bonus rows so Free Spin dashboard tiles have non-zero values
    const demoFreeSpinId = freeSpinIdsByTitle['Demo Free Spin Ongoing']
    if (demoFreeSpinId && freeSpinBonusId) {
      const existingUb = await queryInterface.sequelize.query(
        `SELECT user_bonus_id AS "id" FROM user_bonus WHERE bonus_type = 'free-spin-bonus' AND free_spin_id = :freeSpinId LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { freeSpinId: demoFreeSpinId } }
      )
      if (!existingUb?.[0]?.id) {
        await queryInterface.bulkInsert('user_bonus', [
          {
            bonus_id: freeSpinBonusId,
            user_id: demoUserId,
            bonus_type: 'free-spin-bonus',
            status: 'CLAIMED',
            sc_amount: 7.5,
            gc_amount: 0,
            free_spin_id: demoFreeSpinId,
            claimed_at: new Date(now.getTime() - 15 * 60 * 1000),
            created_at: now,
            updated_at: now
          },
          {
            bonus_id: freeSpinBonusId,
            user_id: demoUserId,
            bonus_type: 'free-spin-bonus',
            status: 'PENDING',
            sc_amount: 0,
            gc_amount: 0,
            free_spin_id: demoFreeSpinId,
            expire_at: new Date(now.getTime() + 2 * 60 * 60 * 1000),
            created_at: now,
            updated_at: now
          }
        ], {})
      }
    }

    // --- Scratch Card (list + dashboard graph totals) ---
    let scratchBonus = await queryInterface.sequelize.query(
      `SELECT bonus_id AS "bonusId" FROM bonus WHERE bonus_type = 'scratch-card-bonus' AND deleted_at IS NULL ORDER BY bonus_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    let scratchBonusId = scratchBonus?.[0]?.bonusId
    if (!scratchBonusId) {
      await queryInterface.bulkInsert('bonus', [{
        parent_type: 'admin',
        parent_id: 1,
        valid_from: now,
        bonus_type: 'scratch-card-bonus',
        currency: JSON.stringify({}),
        is_active: false,
        bonus_name: 'Scratch Card Bonus',
        description: JSON.stringify({}),
        created_at: now,
        updated_at: now
      }], {})
      scratchBonus = await queryInterface.sequelize.query(
        `SELECT bonus_id AS "bonusId" FROM bonus WHERE bonus_type = 'scratch-card-bonus' AND deleted_at IS NULL ORDER BY bonus_id ASC LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )
      scratchBonusId = scratchBonus?.[0]?.bonusId
    }

    const scratchName = 'Demo Scratch Card'
    let scratch = await queryInterface.sequelize.query(
      `SELECT scratch_card_id AS "id" FROM scratch_cards WHERE scratch_card_name = :name AND deleted_at IS NULL LIMIT 1;`,
      { type: QueryTypes.SELECT, replacements: { name: scratchName } }
    )
    let scratchCardId = scratch?.[0]?.id
    if (!scratchCardId) {
      await queryInterface.bulkInsert('scratch_cards', [{
        scratch_card_name: scratchName,
        is_active: true,
        message: 'Win bonus coins instantly (demo)',
        daily_consumed_amount: 0,
        weekly_consumed_amount: 0,
        monthly_consumed_amount: 0,
        created_at: now,
        updated_at: now
      }], {})
      scratch = await queryInterface.sequelize.query(
        `SELECT scratch_card_id AS "id" FROM scratch_cards WHERE scratch_card_name = :name AND deleted_at IS NULL LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { name: scratchName } }
      )
      scratchCardId = scratch?.[0]?.id
    }

    if (scratchCardId) {
      // Ensure at least 2 configurations exist (SC + GC)
      const cfgCount = await queryInterface.sequelize.query(
        `SELECT COUNT(*)::int AS "count" FROM scratch_card_configuration WHERE scratch_card_id = :id AND deleted_at IS NULL;`,
        { type: QueryTypes.SELECT, replacements: { id: scratchCardId } }
      )
      if ((cfgCount?.[0]?.count || 0) < 2) {
        await queryInterface.bulkInsert('scratch_card_configuration', [
          {
            scratch_card_id: scratchCardId,
            min_reward: 0.5,
            max_reward: 5,
            reward_type: 'SC',
            player_limit: 1000,
            percentage: 70,
            is_active: true,
            image_url: 'https://dummyimage.com/300x180/111/00ffcc.png&text=SC',
            message: 'SC Reward (demo)',
            created_at: now,
            updated_at: now
          },
          {
            scratch_card_id: scratchCardId,
            min_reward: 1,
            max_reward: 25,
            reward_type: 'GC',
            player_limit: 200,
            percentage: 30,
            is_active: true,
            image_url: 'https://dummyimage.com/300x180/111/00ffcc.png&text=GC',
            message: 'GC Reward (demo)',
            created_at: now,
            updated_at: now
          }
        ], {})
      }

      // Budgets
      const budgetCount = await queryInterface.sequelize.query(
        `SELECT COUNT(*)::int AS "count" FROM scratch_card_budget_usage WHERE scratch_card_id = :id AND deleted_at IS NULL;`,
        { type: QueryTypes.SELECT, replacements: { id: scratchCardId } }
      )
      if ((budgetCount?.[0]?.count || 0) === 0) {
        await queryInterface.bulkInsert('scratch_card_budget_usage', [
          {
            scratch_card_id: scratchCardId,
            budget_type: 'DAILY',
            budget_amount: 500,
            period_start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)),
            period_end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)),
            is_active: true,
            created_at: now,
            updated_at: now
          },
          {
            scratch_card_id: scratchCardId,
            budget_type: 'MONTHLY',
            budget_amount: 10000,
            period_start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)),
            period_end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59)),
            is_active: true,
            created_at: now,
            updated_at: now
          }
        ], {})
      }

      // user_bonus rows -> list totals + graph totals
      if (scratchBonusId) {
        const existingUb = await queryInterface.sequelize.query(
          `SELECT user_bonus_id AS "id" FROM user_bonus WHERE bonus_type = 'scratch-card-bonus' AND scratch_card_id = :scratchCardId LIMIT 1;`,
          { type: QueryTypes.SELECT, replacements: { scratchCardId } }
        )
        if (!existingUb?.[0]?.id) {
          await queryInterface.bulkInsert('user_bonus', [
            {
              bonus_id: scratchBonusId,
              user_id: demoUserId,
              bonus_type: 'scratch-card-bonus',
              status: 'CLAIMED',
              sc_amount: 3.25,
              gc_amount: 0,
              scratch_card_id: scratchCardId,
              claimed_at: new Date(now.getTime() - 30 * 60 * 1000),
              created_at: now,
              updated_at: now
            },
            {
              bonus_id: scratchBonusId,
              user_id: demoUserId,
              bonus_type: 'scratch-card-bonus',
              status: 'PENDING',
              sc_amount: 1.5,
              gc_amount: 0,
              scratch_card_id: scratchCardId,
              expire_at: new Date(now.getTime() + 24 * 60 * 60 * 1000),
              created_at: now,
              updated_at: now
            },
            {
              bonus_id: scratchBonusId,
              user_id: demoUserId,
              bonus_type: 'scratch-card-bonus',
              status: 'CLAIMED',
              sc_amount: 0,
              gc_amount: 10,
              scratch_card_id: scratchCardId,
              claimed_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
              created_at: now,
              updated_at: now
            }
          ], {})
        }
      }

      // Optional: casino_transactions so scratch-card-bonus details/graph have live points too
      const existingTx = await queryInterface.sequelize.query(
        `SELECT casino_transaction_id AS "id" FROM casino_transactions WHERE transaction_id LIKE 'demo-scratch-%' LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )
      if (!existingTx?.[0]?.id) {
        await queryInterface.bulkInsert('casino_transactions', [
          {
            user_id: demoUserId,
            action_type: 'scratch-card-bonus',
            action_id: '1',
            amount: 3.25,
            currency_code: 'USD',
            status: 1,
            amount_type: 1,
            transaction_id: `demo-scratch-${now.getTime()}-sc`,
            round_id: `demo-scratch-round-${now.getTime()}`,
            more_details: JSON.stringify({
              scratchCardId,
              scratchCardRewardType: 'SC',
              scratchCardBonus: 3.25
            }),
            created_at: new Date(now.getTime() - 30 * 60 * 1000),
            updated_at: new Date(now.getTime() - 30 * 60 * 1000)
          }
        ], {})
      }
    }

    // --- Jackpot (list + current + graphs) ---
    const demoJackpotName = 'Demo Jackpot'
    const existingJackpot = await queryInterface.sequelize.query(
      `SELECT jackpot_id AS "id" FROM jackpots WHERE jackpot_name = :name AND deleted_at IS NULL LIMIT 1;`,
      { type: QueryTypes.SELECT, replacements: { name: demoJackpotName } }
    )

    const jackpotGameId = gameIdsByIdentifier['demo_slots_alpha_1']
    if (!existingJackpot?.[0]?.id && jackpotGameId) {
      await queryInterface.bulkInsert('jackpots', [
        {
          jackpot_name: demoJackpotName,
          max_ticket_size: 5000,
          seed_amount: 1000,
          jackpot_pool_amount: 2500,
          jackpot_pool_earning: 1800,
          entry_amount: 1,
          admin_share: 0.2,
          pool_share: 0.8,
          winning_ticket: 250,
          status: 1,
          game_id: jackpotGameId,
          start_date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          end_date: null,
          ticket_sold: 250,
          created_at: now,
          updated_at: now
        },
        {
          jackpot_name: 'Demo Jackpot Upcoming',
          max_ticket_size: 5000,
          seed_amount: 500,
          jackpot_pool_amount: 500,
          jackpot_pool_earning: 500,
          entry_amount: 1,
          admin_share: 0.2,
          pool_share: 0.8,
          winning_ticket: 150,
          status: 0,
          game_id: jackpotGameId,
          start_date: new Date(now.getTime() + 6 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 10 * 60 * 60 * 1000),
          ticket_sold: 0,
          created_at: now,
          updated_at: now
        },
        {
          jackpot_name: 'Demo Jackpot Completed',
          max_ticket_size: 5000,
          seed_amount: 750,
          jackpot_pool_amount: 5000,
          jackpot_pool_earning: 3200,
          entry_amount: 1,
          admin_share: 0.2,
          pool_share: 0.8,
          winning_ticket: 400,
          status: 2,
          game_id: jackpotGameId,
          start_date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          ticket_sold: 400,
          user_id: demoUserId,
          created_at: now,
          updated_at: now
        }
      ], {})
    }

    // Optional: casino_transactions for jackpot graph revenue
    const existingJackpotTx = await queryInterface.sequelize.query(
      `SELECT casino_transaction_id AS "id" FROM casino_transactions WHERE transaction_id LIKE 'demo-jackpot-%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    if (!existingJackpotTx?.[0]?.id) {
      await queryInterface.bulkInsert('casino_transactions', [
        {
          user_id: demoUserId,
          action_type: 'jackpotEntry',
          action_id: '0',
          amount: 50,
          currency_code: 'USD',
          status: 1,
          amount_type: 1,
          transaction_id: `demo-jackpot-${now.getTime()}-1`,
          round_id: `demo-jackpot-round-${now.getTime()}-1`,
          created_at: new Date(now.getTime() - 20 * 60 * 1000),
          updated_at: new Date(now.getTime() - 20 * 60 * 1000)
        },
        {
          user_id: demoUserId,
          action_type: 'jackpotEntry',
          action_id: '0',
          amount: 75,
          currency_code: 'USD',
          status: 1,
          amount_type: 1,
          transaction_id: `demo-jackpot-${now.getTime()}-2`,
          round_id: `demo-jackpot-round-${now.getTime()}-2`,
          created_at: new Date(now.getTime() - 10 * 60 * 1000),
          updated_at: new Date(now.getTime() - 10 * 60 * 1000)
        }
      ], {})
    }
  },

  // Keep down non-destructive: only delete rows created by this seeder (by stable demo names).
  async down (queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM casino_transactions WHERE transaction_id LIKE 'demo-scratch-%' OR transaction_id LIKE 'demo-jackpot-%';`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM user_bonus WHERE bonus_type IN ('free-spin-bonus','scratch-card-bonus') AND (free_spin_id IS NOT NULL OR scratch_card_id IS NOT NULL);`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM free_spin_bonus_grant WHERE title LIKE 'Demo Free Spin %';`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM scratch_card_budget_usage WHERE scratch_card_id IN (SELECT scratch_card_id FROM scratch_cards WHERE scratch_card_name = 'Demo Scratch Card');`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM scratch_card_configuration WHERE scratch_card_id IN (SELECT scratch_card_id FROM scratch_cards WHERE scratch_card_name = 'Demo Scratch Card');`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM scratch_cards WHERE scratch_card_name = 'Demo Scratch Card';`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM jackpots WHERE jackpot_name IN ('Demo Jackpot','Demo Jackpot Upcoming','Demo Jackpot Completed');`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM game_subcategory WHERE master_game_sub_category_id IN (SELECT master_game_sub_category_id FROM master_game_sub_categories WHERE slug LIKE 'demo-%');`
    )
    await queryInterface.sequelize.query(
      `DELETE FROM master_game_sub_categories WHERE slug LIKE 'demo-%';`
    )
  }
}

