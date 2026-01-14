'use strict'

const { QueryTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

// Adds demo data for:
// - /admin/transactions/casino-transactions (casino_transactions)
// - /admin/transactions-banking (transaction_bankings + withdraw_requests union)
// - /admin/transactions-withdraw (withdraw_requests + joins)
// - /admin/transactions-vault (wallets vault_* coins)
//
// Uses the demo users created by: 20260112121000-demo-player-data.js
module.exports = {
  async up (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const now = new Date()
      const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
      const asJsonbLiteral = (obj) =>
        queryInterface.sequelize.literal(`'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`)

      const demoEmails = [
        'ava.miller+demo@demo.com',
        'noah.johnson+demo@demo.com',
        'mia.davis+demo@demo.com',
        'liam.brown+demo@demo.com',
        'sophia.wilson+demo@demo.com'
      ]

      const emailListSql = demoEmails.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')

      const users = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId", email, username FROM users WHERE email IN (${emailListSql}) ORDER BY user_id ASC;`,
        { type: QueryTypes.SELECT, transaction }
      )

      if (!users.length) {
        await transaction.commit()
        return
      }

      const userIdsSql = users.map(u => u.userId).join(', ')

      // Grab wallets for these users (needed for transaction_bankings.wallet_id)
      const wallets = await queryInterface.sequelize.query(
        `SELECT wallet_id AS "walletId", owner_id AS "ownerId", currency_code AS "currencyCode"
         FROM wallets
         WHERE owner_id IN (${userIdsSql})
         ORDER BY owner_id ASC;`,
        { type: QueryTypes.SELECT, transaction }
      )

      const walletByUserId = new Map(wallets.map(w => [w.ownerId, w]))

      // Pick any existing casino game id so casino transaction list can show a name
      const gameRow = await queryInterface.sequelize.query(
        `SELECT master_casino_game_id AS "gameId" FROM master_casino_games ORDER BY master_casino_game_id ASC LIMIT 1;`,
        { type: QueryTypes.SELECT, transaction }
      )
      const gameId = gameRow?.[0]?.gameId ? String(gameRow[0].gameId) : null

      // Cleanup old demo seed rows (safe if re-run locally)
      await queryInterface.sequelize.query(
        `DELETE FROM casino_transactions
         WHERE user_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await queryInterface.sequelize.query(
        `DELETE FROM transaction_bankings
         WHERE actionee_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await queryInterface.sequelize.query(
        `DELETE FROM withdraw_requests
         WHERE user_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )

      // ------------------------------------------------------------
      // Vault: give 2 users some vault coins so Vault page shows data
      // ------------------------------------------------------------
      const vaultUsers = users.slice(0, 2)
      for (const [idx, u] of vaultUsers.entries()) {
        const w = walletByUserId.get(u.userId)
        if (!w) continue

        const vaultSc = { wsc: 5 + idx * 2, psc: 2 + idx, bsc: 1 }
        const vaultGc = 25 + idx * 10

        await queryInterface.sequelize.query(
          `UPDATE wallets
           SET vault_sc_coin = :vaultSc::jsonb,
               vault_gc_coin = :vaultGc,
               updated_at = :updatedAt
           WHERE wallet_id = :walletId;`,
          {
            type: QueryTypes.UPDATE,
            transaction,
            replacements: {
              vaultSc: JSON.stringify(vaultSc),
              vaultGc,
              updatedAt: now,
              walletId: w.walletId
            }
          }
        )
      }

      // ------------------------------------------------------------
      // Withdraw Requests (Redeem Requests page)
      // ------------------------------------------------------------
      const withdrawRequests = []
      const transactionBankings = []
      const casinoTransactions = []

      users.forEach((u, idx) => {
        const wallet = walletByUserId.get(u.userId)
        if (!wallet) return

        // --- Withdraw requests: create one pending + one approved ---
        const redeemTxIdPending = `demo-redeem-${uuidv4()}`
        const redeemTxIdApproved = `demo-redeem-${uuidv4()}`

        withdrawRequests.push(
          {
            user_id: u.userId,
            status: 0, // PENDING
            name: u.username || 'Demo User',
            email: u.email,
            amount: 15 + idx * 2,
            transaction_id: redeemTxIdPending,
            actionable_email: u.email,
            payment_provider: 'SKRILL',
            more_details: asJsonbLiteral({ seed: 'demo', ipAddress: '127.0.0.1' }),
            created_at: daysAgo(3 + idx),
            updated_at: daysAgo(3 + idx)
          },
          {
            user_id: u.userId,
            status: 1, // SUCCESS / APPROVED
            name: u.username || 'Demo User',
            email: u.email,
            amount: 10 + idx,
            transaction_id: redeemTxIdApproved,
            actionable_email: u.email,
            payment_provider: 'PAY_BY_BANK',
            more_details: asJsonbLiteral({ seed: 'demo', ipAddress: '10.0.0.2' }),
            created_at: daysAgo(10 + idx),
            updated_at: daysAgo(9 + idx)
          }
        )

        // --- Transaction bankings (Transactions Banking page) ---
        // Deposit / purchase-like entries (not redeem)
        transactionBankings.push(
          {
            actionee_type: 'user',
            actionee_id: u.userId,
            actionee_email: u.email,
            actionee_name: u.username || 'Demo User',
            wallet_id: wallet.walletId,
            currency_code: wallet.currencyCode || 'USD',
            amount: 25 + idx * 10,
            gc_coin: 0,
            sc_coin: 25 + idx * 10,
            status: 1,
            country_code: 'US',
            transaction_id: uuidv4(),
            transaction_date_time: daysAgo(12 + idx),
            transaction_type: 'deposit',
            is_success: true,
            payment_method: 'card',
            payment_transaction_id: `demo-pay-${uuidv4()}`,
            more_details: asJsonbLiteral({ seed: 'demo', note: 'Demo deposit' }),
            created_at: daysAgo(12 + idx),
            updated_at: daysAgo(12 + idx),
            is_first_deposit: idx === 0,
            elastic_updated: false,
            promocode_id: 0,
            promocode_bonus_sc: 0,
            promocode_bonus_gc: 0,
            promocode_discount: 0
          },
          {
            actionee_type: 'user',
            actionee_id: u.userId,
            actionee_email: u.email,
            actionee_name: u.username || 'Demo User',
            wallet_id: wallet.walletId,
            currency_code: wallet.currencyCode || 'USD',
            amount: 5 + idx,
            gc_coin: 0,
            sc_coin: 5 + idx,
            status: 1,
            country_code: 'US',
            transaction_id: uuidv4(),
            transaction_date_time: daysAgo(2 + idx),
            transaction_type: 'addSc',
            is_success: true,
            payment_method: 'admin',
            payment_transaction_id: null,
            more_details: asJsonbLiteral({ seed: 'demo', adminUserId: 1, remarks: 'Demo adjustment' }),
            created_at: daysAgo(2 + idx),
            updated_at: daysAgo(2 + idx),
            is_first_deposit: false,
            elastic_updated: false,
            promocode_id: 0,
            promocode_bonus_sc: 0,
            promocode_bonus_gc: 0,
            promocode_discount: 0
          }
        )

        // Also add a "redeem" transaction in transaction_bankings so redeem list can compute lastWithdrawalDate
        transactionBankings.push({
          actionee_type: 'user',
          actionee_id: u.userId,
          actionee_email: u.email,
          actionee_name: u.username || 'Demo User',
          wallet_id: wallet.walletId,
          currency_code: wallet.currencyCode || 'USD',
          amount: 10 + idx,
          gc_coin: 0,
          sc_coin: 10 + idx,
          status: 1,
          country_code: 'US',
          transaction_id: uuidv4(),
          transaction_date_time: daysAgo(9 + idx),
          transaction_type: 'redeem',
          is_success: true,
          payment_method: 'withdraw',
          payment_transaction_id: `demo-redeem-pay-${uuidv4()}`,
          more_details: asJsonbLiteral({ seed: 'demo', note: 'Demo redeem banking entry' }),
          created_at: daysAgo(9 + idx),
          updated_at: daysAgo(9 + idx),
          is_first_deposit: false,
          elastic_updated: false,
          promocode_id: 0,
          promocode_bonus_sc: 0,
          promocode_bonus_gc: 0,
          promocode_discount: 0
        })

        // --- Casino transactions (Casino Transactions page) ---
        // Minimum required: user_id, action_type, action_id, transaction_id, round_id
        const roundId = `demo-round-${uuidv4()}`
        casinoTransactions.push(
          {
            user_id: u.userId,
            game_identifier: null,
            game_id: gameId,
            wallet_id: wallet.walletId,
            action_type: 'bet',
            action_id: '0',
            amount: 2.5 + idx * 0.5,
            status: 1,
            currency_code: wallet.currencyCode || 'USD',
            amount_type: 1, // sc
            elastic_updated: false,
            is_sticky: false,
            before_balance: 100,
            after_balance: 97.5,
            user_bonus_id: null,
            transaction_id: `demo-casino-${uuidv4()}`,
            round_id: roundId,
            round_status: false,
            device: 'web',
            sc: 2.5 + idx * 0.5,
            gc: 0,
            more_details: asJsonbLiteral({ seed: 'demo', psc: 0, bsc: 0, wsc: 0 }),
            created_at: daysAgo(4 + idx),
            updated_at: daysAgo(4 + idx)
          },
          {
            user_id: u.userId,
            game_identifier: null,
            game_id: gameId,
            wallet_id: wallet.walletId,
            action_type: 'win',
            action_id: '1',
            amount: 4.25 + idx * 0.75,
            status: 1,
            currency_code: wallet.currencyCode || 'USD',
            amount_type: 1, // sc
            elastic_updated: false,
            is_sticky: false,
            before_balance: 97.5,
            after_balance: 101.75,
            user_bonus_id: null,
            transaction_id: `demo-casino-${uuidv4()}`,
            round_id: roundId,
            round_status: true,
            device: 'web',
            sc: 4.25 + idx * 0.75,
            gc: 0,
            more_details: asJsonbLiteral({ seed: 'demo', psc: 0, bsc: 0, wsc: 0 }),
            created_at: daysAgo(4 + idx),
            updated_at: daysAgo(4 + idx)
          }
        )
      })

      if (withdrawRequests.length) {
        await queryInterface.bulkInsert('withdraw_requests', withdrawRequests, { transaction })
      }
      if (transactionBankings.length) {
        await queryInterface.bulkInsert('transaction_bankings', transactionBankings, { transaction })
      }
      if (casinoTransactions.length) {
        await queryInterface.bulkInsert('casino_transactions', casinoTransactions, { transaction })
      }

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const demoEmails = [
        'ava.miller+demo@demo.com',
        'noah.johnson+demo@demo.com',
        'mia.davis+demo@demo.com',
        'liam.brown+demo@demo.com',
        'sophia.wilson+demo@demo.com'
      ]
      const emailListSql = demoEmails.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')
      const users = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM users WHERE email IN (${emailListSql});`,
        { type: QueryTypes.SELECT, transaction }
      )
      const userIds = users.map(u => u.userId).filter(Boolean)
      if (!userIds.length) {
        await transaction.commit()
        return
      }
      const userIdsSql = userIds.join(', ')

      await queryInterface.sequelize.query(
        `DELETE FROM casino_transactions
         WHERE user_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await queryInterface.sequelize.query(
        `DELETE FROM transaction_bankings
         WHERE actionee_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await queryInterface.sequelize.query(
        `DELETE FROM withdraw_requests
         WHERE user_id IN (${userIdsSql})
           AND (more_details->>'seed') = 'demo';`,
        { transaction }
      )

      // Reset vault coins (best-effort)
      await queryInterface.sequelize.query(
        `UPDATE wallets
         SET vault_gc_coin = 0,
             vault_sc_coin = '{}'::jsonb,
             updated_at = NOW()
         WHERE owner_id IN (${userIdsSql});`,
        { transaction }
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}

