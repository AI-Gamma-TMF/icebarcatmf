'use strict'

const { QueryTypes } = require('sequelize')

// Demo users are for the admin "Players" page (GET /api/v1/user/)
// That endpoint expects data joined from:
// - users
// - wallets (sc_coin JSON -> scBalance)
// - users_tiers + tiers (tierName)
// - user_reports (totalPurchaseAmount / totalRedemptionAmount / playThrough)

module.exports = {
  async up (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const now = new Date()
      const passwordHash = '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m' // Admin@123!
      const asJsonbLiteral = (obj) =>
        queryInterface.sequelize.literal(`'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`)

      const demoUsers = [
        {
          first_name: 'Ava',
          last_name: 'Miller',
          email: 'ava.miller+demo@demo.com',
          username: 'avam',
          phone: '555010001',
          phone_code: '+1',
          password: passwordHash,
          date_of_birth: new Date('1992-04-12'),
          gender: 'Female',
          sign_in_method: '0',
          currency_code: 'USD',
          kyc_status: 'APPROVED',
          is_email_verified: true,
          is_active: true,
          last_login_date: new Date('2025-12-15'),
          created_at: new Date('2024-09-10'),
          updated_at: now
        },
        {
          first_name: 'Noah',
          last_name: 'Johnson',
          email: 'noah.johnson+demo@demo.com',
          username: 'noahj',
          phone: '555010002',
          phone_code: '+1',
          password: passwordHash,
          date_of_birth: new Date('1988-02-03'),
          gender: 'Male',
          sign_in_method: '0',
          currency_code: 'USD',
          kyc_status: 'PENDING',
          is_email_verified: true,
          is_active: true,
          last_login_date: new Date('2025-12-02'),
          created_at: new Date('2024-10-04'),
          updated_at: now
        },
        {
          first_name: 'Mia',
          last_name: 'Davis',
          email: 'mia.davis+demo@demo.com',
          username: 'miad',
          phone: '555010003',
          phone_code: '+1',
          password: passwordHash,
          date_of_birth: new Date('1996-07-21'),
          gender: 'Female',
          sign_in_method: '0',
          currency_code: 'USD',
          kyc_status: 'APPROVED',
          is_email_verified: true,
          is_active: false,
          last_login_date: new Date('2025-10-18'),
          created_at: new Date('2024-11-12'),
          updated_at: now
        },
        {
          first_name: 'Liam',
          last_name: 'Brown',
          email: 'liam.brown+demo@demo.com',
          username: 'liamb',
          phone: '555010004',
          phone_code: '+1',
          password: passwordHash,
          date_of_birth: new Date('1990-11-30'),
          gender: 'Male',
          sign_in_method: '0',
          currency_code: 'USD',
          kyc_status: 'REJECTED',
          is_email_verified: true,
          is_active: true,
          last_login_date: new Date('2025-12-28'),
          created_at: new Date('2024-12-01'),
          updated_at: now
        },
        {
          first_name: 'Sophia',
          last_name: 'Wilson',
          email: 'sophia.wilson+demo@demo.com',
          username: 'sophw',
          phone: '555010005',
          phone_code: '+1',
          password: passwordHash,
          date_of_birth: new Date('1985-03-18'),
          gender: 'Female',
          sign_in_method: '0',
          currency_code: 'USD',
          kyc_status: 'APPROVED',
          is_email_verified: true,
          is_active: true,
          last_login_date: new Date('2026-01-01'),
          created_at: new Date('2025-01-22'),
          updated_at: now
        }
      ]

      const demoEmails = demoUsers.map(u => u.email)
      const emailListSql = demoEmails.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')

      // Cleanup (idempotent)
      const existing = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM users WHERE email IN (${emailListSql});`,
        { type: QueryTypes.SELECT, transaction }
      )
      const existingIds = existing.map(r => r.userId).filter(Boolean)
      if (existingIds.length > 0) {
        const idsSql = existingIds.join(', ')
        await queryInterface.sequelize.query(`DELETE FROM wallets WHERE owner_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM user_reports WHERE user_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM users_tiers WHERE user_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM users WHERE user_id IN (${idsSql});`, { transaction })
      }

      // Insert users
      await queryInterface.bulkInsert('users', demoUsers, { transaction })

      const inserted = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId", email FROM users WHERE email IN (${emailListSql});`,
        { type: QueryTypes.SELECT, transaction }
      )

      // Use Tier level 1 (Nexus) by default
      const tierRow = await queryInterface.sequelize.query(
        `SELECT tier_id AS "tierId" FROM tiers WHERE level = 1 ORDER BY tier_id ASC LIMIT 1;`,
        { type: QueryTypes.SELECT, transaction }
      )
      const tierId = tierRow?.[0]?.tierId || null

      const wallets = []
      const userReports = []
      const usersTiers = []

      inserted.forEach((u, idx) => {
        const userId = u.userId
        if (!userId) return

        // Make balances different per user (scBalance = wsc + psc + bsc)
        const wsc = 12.5 + idx * 5.25
        const psc = 3.0 + idx * 1.75
        const bsc = idx % 2 === 0 ? 2.0 : 0.5

        const totalPurchaseAmount = 50 + idx * 25
        const totalRedemptionAmount = idx % 2 === 0 ? 0 : 10 + idx * 5
        const totalScBetAmount = 40 + idx * 15
        const totalScWinAmount = 15 + idx * 7

        wallets.push({
          currency_code: 'USD',
          owner_type: 'user',
          owner_id: userId,
          amount: 0,
          non_cash_amount: 0,
          gc_coin: 0,
          sc_bonus_coin: 0,
          gc_bonus_coin: 0,
          // NOTE: queryInterface.bulkInsert doesn't know column datatypes, so
          // raw JS objects can throw "Invalid value { ... }" during SQL generation.
          // Use explicit JSONB literal for Postgres.
          sc_coin: asJsonbLiteral({ wsc, psc, bsc }),
          vault_gc_coin: 0,
          vault_sc_coin: asJsonbLiteral({ wsc: 0, psc: 0, bsc: 0 }),
          created_at: now,
          updated_at: now
        })

        userReports.push({
          user_id: userId,
          total_purchase_amount: totalPurchaseAmount,
          purchase_count: Math.max(1, idx),
          total_redemption_amount: totalRedemptionAmount,
          redemption_count: totalRedemptionAmount > 0 ? 1 : 0,
          total_pending_redemption_amount: 0,
          pending_redemption_count: 0,
          total_sc_bet_amount: totalScBetAmount,
          total_sc_win_amount: totalScWinAmount,
          cancelled_redemption_count: 0,
          cancelled_redemption_amount: 0,
          created_at: now,
          updated_at: now
        })

        if (tierId) {
          usersTiers.push({
            tier_id: tierId,
            user_id: userId,
            level: 1,
            max_level: 1,
            sc_spend: 0,
            gc_spend: 0,
            created_at: now,
            updated_at: now
          })
        }
      })

      if (wallets.length > 0) await queryInterface.bulkInsert('wallets', wallets, { transaction })
      if (userReports.length > 0) await queryInterface.bulkInsert('user_reports', userReports, { transaction })
      if (usersTiers.length > 0) await queryInterface.bulkInsert('users_tiers', usersTiers, { transaction })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const emails = [
        'ava.miller+demo@demo.com',
        'noah.johnson+demo@demo.com',
        'mia.davis+demo@demo.com',
        'liam.brown+demo@demo.com',
        'sophia.wilson+demo@demo.com'
      ]
      const emailListSql = emails.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')
      const rows = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM users WHERE email IN (${emailListSql});`,
        { type: QueryTypes.SELECT, transaction }
      )
      const ids = rows.map(r => r.userId).filter(Boolean)
      if (ids.length > 0) {
        const idsSql = ids.join(', ')
        await queryInterface.sequelize.query(`DELETE FROM wallets WHERE owner_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM user_reports WHERE user_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM users_tiers WHERE user_id IN (${idsSql});`, { transaction })
        await queryInterface.sequelize.query(`DELETE FROM users WHERE user_id IN (${idsSql});`, { transaction })
      }
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}

