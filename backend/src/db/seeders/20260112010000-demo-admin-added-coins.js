'use strict'

/**
 * Demo seed: Admin Added Coins dashboard
 *
 * This populates `transaction_bankings` with a handful of admin credit/deduct
 * transactions so `/admin/admin-added-coins` has data on fresh demo DBs.
 *
 * Data source (backend): GetAdminCreditCoinsService
 *  - reads transaction_bankings where transaction_type in addSc/addGc/removeSc/removeGc
 *  - groups by more_details.adminUserId
 *
 * IMPORTANT:
 *  - `country_code` is NOT NULL, so we always set it.
 *  - We tag rows with `more_details.demoSeed = 'adminAddedCoinsV1'` for idempotency.
 */

module.exports = {
  async up (queryInterface, Sequelize) {
    const DEMO_TAG = 'adminAddedCoinsV1'

    // Pick a few demo staff emails (seeded by 20260112000000-demo-staff-data.js)
    const demoStaffEmails = [
      'sarah.johnson@demo.com',
      'alex.thompson@demo.com',
      'emma.rodriguez@demo.com'
    ]

    let admins = await queryInterface.sequelize.query(
      `SELECT admin_user_id, email, first_name, last_name
       FROM admin_users
       WHERE email IN (${demoStaffEmails.map(e => `'${e}'`).join(', ')})`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Local/dev DBs may not have demo staff emails yet. Fallback to any admins.
    if (!admins || admins.length === 0) {
      admins = await queryInterface.sequelize.query(
        `SELECT admin_user_id, email, first_name, last_name
         FROM admin_users
         ORDER BY admin_user_id ASC
         LIMIT 3`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    }

    if (!admins || admins.length === 0) return

    // Idempotency: if we already seeded any rows with this tag, skip.
    const existing = await queryInterface.sequelize.query(
      `SELECT transaction_banking_id
       FROM transaction_bankings
       WHERE (more_details->>'demoSeed') = '${DEMO_TAG}'
       LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    if (existing && existing.length > 0) return

    const now = Date.now()
    const mkDate = (minsAgo) => new Date(now - minsAgo * 60 * 1000)

    // Simple synthetic "players" the admin credited/deducted.
    // NOTE: `transaction_bankings.actionee_id` has a FK to `users.user_id`,
    // so we keep `actionee_id` NULL and only populate email/name.
    const demoPlayers = [
      { email: 'player.one@demo.com', name: 'Player One' },
      { email: 'player.two@demo.com', name: 'Player Two' },
      { email: 'player.three@demo.com', name: 'Player Three' }
    ]

    const rows = []

    // Create a few transactions per admin (SC + GC, add + remove)
    admins.forEach((admin, idx) => {
      const adminUserId = admin.admin_user_id
      const staffLabel = `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || admin.email
      const baseMinsAgo = 120 + idx * 30

      // addSc (ensure there is a "most recent" addSc overall as well)
      rows.push({
        actionee_type: 'User',
        actionee_id: null,
        actionee_email: demoPlayers[0].email,
        actionee_name: demoPlayers[0].name,
        currency_code: 'USD',
        amount: 25 + idx * 10,
        gc_coin: 0,
        sc_coin: 25 + idx * 10,
        status: 1,
        country_code: 'US',
        transaction_type: 'addSc',
        is_success: true,
        transaction_date_time: mkDate(baseMinsAgo).toISOString(),
        more_details: {
          adminUserId,
          remarks: `Demo: ${staffLabel} credited SC`,
          demoSeed: DEMO_TAG
        },
        created_at: mkDate(baseMinsAgo),
        updated_at: mkDate(baseMinsAgo)
      })

      // removeSc
      rows.push({
        actionee_type: 'User',
        actionee_id: null,
        actionee_email: demoPlayers[1].email,
        actionee_name: demoPlayers[1].name,
        currency_code: 'USD',
        amount: 5 + idx * 2,
        gc_coin: 0,
        sc_coin: 5 + idx * 2,
        status: 1,
        country_code: 'US',
        transaction_type: 'removeSc',
        is_success: true,
        transaction_date_time: mkDate(baseMinsAgo - 15).toISOString(),
        more_details: {
          adminUserId,
          remarks: `Demo: ${staffLabel} deducted SC (fraud adjustment)`,
          demoSeed: DEMO_TAG
        },
        created_at: mkDate(baseMinsAgo - 15),
        updated_at: mkDate(baseMinsAgo - 15)
      })

      // addGc
      rows.push({
        actionee_type: 'User',
        actionee_id: null,
        actionee_email: demoPlayers[2].email,
        actionee_name: demoPlayers[2].name,
        currency_code: 'USD',
        amount: 1000 + idx * 250,
        gc_coin: 1000 + idx * 250,
        sc_coin: 0,
        status: 1,
        country_code: 'US',
        transaction_type: 'addGc',
        is_success: true,
        transaction_date_time: mkDate(baseMinsAgo - 30).toISOString(),
        more_details: {
          adminUserId,
          remarks: `Demo: ${staffLabel} credited GC`,
          demoSeed: DEMO_TAG
        },
        created_at: mkDate(baseMinsAgo - 30),
        updated_at: mkDate(baseMinsAgo - 30)
      })

      // removeGc
      rows.push({
        actionee_type: 'User',
        actionee_id: null,
        actionee_email: demoPlayers[0].email,
        actionee_name: demoPlayers[0].name,
        currency_code: 'USD',
        amount: 200 + idx * 50,
        gc_coin: 200 + idx * 50,
        sc_coin: 0,
        status: 1,
        country_code: 'US',
        transaction_type: 'removeGc',
        is_success: true,
        transaction_date_time: mkDate(baseMinsAgo - 45).toISOString(),
        more_details: {
          adminUserId,
          remarks: `Demo: ${staffLabel} deducted GC`,
          demoSeed: DEMO_TAG
        },
        created_at: mkDate(baseMinsAgo - 45),
        updated_at: mkDate(baseMinsAgo - 45)
      })
    })

    // Ensure "most recent" addSc exists and is very recent
    const mostRecentAdmin = admins[0]
    if (mostRecentAdmin) {
      rows.push({
        actionee_type: 'User',
        actionee_id: null,
        actionee_email: demoPlayers[2].email,
        actionee_name: demoPlayers[2].name,
        currency_code: 'USD',
        amount: 15,
        gc_coin: 0,
        sc_coin: 15,
        status: 1,
        country_code: 'US',
        transaction_type: 'addSc',
        is_success: true,
        transaction_date_time: mkDate(3).toISOString(),
        more_details: {
          adminUserId: mostRecentAdmin.admin_user_id,
          remarks: 'Demo: quick goodwill SC credit',
          demoSeed: DEMO_TAG
        },
        created_at: mkDate(3),
        updated_at: mkDate(3)
      })
    }

    // NOTE: queryInterface.bulkInsert does not reliably serialize JSONB objects in this repo's setup.
    // Use parameterized raw INSERT with explicit ::jsonb cast.
    for (const row of rows) {
      await queryInterface.sequelize.query(
        `INSERT INTO transaction_bankings (
          actionee_type,
          actionee_id,
          actionee_email,
          actionee_name,
          currency_code,
          amount,
          gc_coin,
          sc_coin,
          status,
          country_code,
          transaction_type,
          is_success,
          transaction_date_time,
          more_details,
          created_at,
          updated_at
        ) VALUES (
          :actionee_type,
          :actionee_id,
          :actionee_email,
          :actionee_name,
          :currency_code,
          :amount,
          :gc_coin,
          :sc_coin,
          :status,
          :country_code,
          :transaction_type,
          :is_success,
          :transaction_date_time,
          CAST(:more_details AS jsonb),
          :created_at,
          :updated_at
        )`,
        {
          replacements: {
            ...row,
            more_details: JSON.stringify(row.more_details)
          }
        }
      )
    }
  },

  async down (queryInterface, Sequelize) {
    const DEMO_TAG = 'adminAddedCoinsV1'
    await queryInterface.sequelize.query(
      `DELETE FROM transaction_bankings WHERE (more_details->>'demoSeed') = '${DEMO_TAG}'`
    )
  }
}

