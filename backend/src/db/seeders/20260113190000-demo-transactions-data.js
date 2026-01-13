'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for Transactions sections:
// - Casino Transactions (GET /api/v1/casino/transactions) -> casino_transactions table
// - Transactions Banking (GET /api/v1/transaction) -> transaction_bankings table
// - Redeem Requests (GET /api/v1/transaction?transactionType=redeem) -> transaction_bankings where transactionType='redeem'
// - Vault (wallet vault balances) -> wallets table (vaultGcCoin, vaultScCoin)
//
// This seeder is idempotent: it checks for existing demo data before inserting.

// Transaction statuses
const TRANSACTION_STATUS = {
  INITIATED: -1,
  PENDING: 0,
  SUCCESS: 1,
  CANCELED: 2,
  FAILED: 3,
  INPROGRESS: 4,
  APPROVED: 5,
  DECLINED: 6,
  ROLLBACK: 7,
  SCHEDULED: 8
}

module.exports = {
  async up (queryInterface) {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // Get existing users with their wallets
    const usersWithWallets = await queryInterface.sequelize.query(
      `SELECT u.user_id AS "userId", u.email, u.first_name AS "firstName", 
              w.wallet_id AS "walletId", w.currency_code AS "currencyCode"
       FROM users u
       LEFT JOIN wallets w ON w.owner_id = u.user_id AND w.owner_type = 'user'
       ORDER BY u.user_id ASC
       LIMIT 10;`,
      { type: QueryTypes.SELECT }
    )

    if (usersWithWallets.length < 3) {
      console.log('Not enough users to create transaction demo data, skipping...')
      return
    }

    // Get demo games for casino transactions
    const demoGames = await queryInterface.sequelize.query(
      `SELECT master_casino_game_id AS "id", identifier, name
       FROM master_casino_games
       WHERE identifier LIKE 'demo_%' OR name LIKE 'Demo%'
       LIMIT 4;`,
      { type: QueryTypes.SELECT }
    )

    // ========================================
    // 1. Casino Transactions
    // ========================================
    const existingCasinoTx = await queryInterface.sequelize.query(
      `SELECT casino_transaction_id AS "id" FROM casino_transactions 
       WHERE transaction_id LIKE 'demo-tx-%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingCasinoTx.length === 0 && demoGames.length > 0) {
      const casinoTransactions = []
      const actionTypes = ['bet', 'win', 'bet', 'win', 'bet', 'bet', 'win', 'cancel']
      const actionIds = ['0', '1', '0', '1', '0', '0', '1', '2'] // 0=DEBIT, 1=CREDIT, 2=CANCEL
      const devices = ['desktop', 'mobile', 'tablet', 'desktop']

      let txCounter = 1
      for (let i = 0; i < usersWithWallets.length && i < 5; i++) {
        const user = usersWithWallets[i]
        
        // Create multiple transactions per user across different dates
        const dates = [now, oneDayAgo, threeDaysAgo, sevenDaysAgo]
        
        for (let d = 0; d < dates.length; d++) {
          const game = demoGames[d % demoGames.length]
          const actionIndex = (i + d) % actionTypes.length
          const isBet = actionTypes[actionIndex] === 'bet'
          const amount = isBet ? (Math.random() * 50 + 5).toFixed(2) : (Math.random() * 100 + 10).toFixed(2)
          const scAmount = (parseFloat(amount) * 0.1).toFixed(2)
          const gcAmount = (parseFloat(amount) * 10).toFixed(2)

          casinoTransactions.push({
            user_id: user.userId,
            game_identifier: game.identifier,
            game_id: String(game.id),
            action_type: actionTypes[actionIndex],
            action_id: actionIds[actionIndex],
            amount: parseFloat(amount),
            status: 1, // SUCCESS
            amount_type: Math.random() > 0.5 ? 1 : 0, // 0=GC, 1=SC
            before_balance: (Math.random() * 1000 + 100).toFixed(2),
            after_balance: (Math.random() * 1000 + 100).toFixed(2),
            transaction_id: `demo-tx-${txCounter++}-${Date.now()}`,
            round_id: `demo-round-${Math.floor(Math.random() * 10000)}`,
            round_status: true,
            device: devices[d % devices.length],
            sc: parseFloat(scAmount),
            gc: parseFloat(gcAmount),
            currency_code: 'USD',
            more_details: JSON.stringify({ psc: 0, bsc: 0, wsc: parseFloat(scAmount) }),
            created_at: dates[d],
            updated_at: dates[d]
          })
        }
      }

      await queryInterface.bulkInsert('casino_transactions', casinoTransactions, {})
      console.log(`Inserted ${casinoTransactions.length} demo casino transactions`)
    }

    // ========================================
    // 2. Transaction Banking (Deposits, Withdrawals, Bonuses)
    // ========================================
    const existingBankingTx = await queryInterface.sequelize.query(
      `SELECT transaction_banking_id AS "id" FROM transaction_bankings 
       WHERE payment_transaction_id LIKE 'demo-banking-%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingBankingTx.length === 0) {
      const bankingTransactions = []
      
      // Transaction types for variety
      const transactionTypes = [
        { type: 'deposit', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true },
        { type: 'deposit', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true },
        { type: 'deposit', status: TRANSACTION_STATUS.PENDING, isSuccess: false },
        { type: 'redeem', status: TRANSACTION_STATUS.PENDING, isSuccess: false },
        { type: 'redeem', status: TRANSACTION_STATUS.APPROVED, isSuccess: true },
        { type: 'redeem', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true },
        { type: 'redeem', status: TRANSACTION_STATUS.DECLINED, isSuccess: false },
        { type: 'bonus', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true },
        { type: 'addSc', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true },
        { type: 'addGc', status: TRANSACTION_STATUS.SUCCESS, isSuccess: true }
      ]

      const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'crypto', 'e-wallet']
      let bankingCounter = 1

      for (let i = 0; i < usersWithWallets.length && i < 8; i++) {
        const user = usersWithWallets[i]
        if (!user.walletId) continue

        // Create multiple banking transactions per user
        const dates = [now, oneDayAgo, threeDaysAgo, sevenDaysAgo, fourteenDaysAgo]
        
        for (let d = 0; d < dates.length; d++) {
          const txType = transactionTypes[(i + d) % transactionTypes.length]
          const isDeposit = txType.type === 'deposit'
          const isRedeem = txType.type === 'redeem'
          const amount = isDeposit 
            ? (Math.random() * 200 + 20).toFixed(2) 
            : isRedeem 
              ? (Math.random() * 100 + 10).toFixed(2)
              : (Math.random() * 50 + 5).toFixed(2)

          const scCoin = isDeposit ? parseFloat(amount) : isRedeem ? parseFloat(amount) : parseFloat(amount) * 0.5
          const gcCoin = isDeposit ? parseFloat(amount) * 10000 : 0

          bankingTransactions.push({
            actionee_type: 'user',
            actionee_id: user.userId,
            actionee_email: user.email,
            actionee_name: user.firstName || 'Demo User',
            wallet_id: user.walletId,
            currency_code: user.currencyCode || 'USD',
            amount: parseFloat(amount),
            gc_coin: gcCoin,
            sc_coin: scCoin,
            before_balance: JSON.stringify({ gc: Math.random() * 100000, sc: { psc: Math.random() * 500, wsc: Math.random() * 200, bsc: Math.random() * 100 } }),
            after_balance: JSON.stringify({ gc: Math.random() * 100000 + gcCoin, sc: { psc: Math.random() * 500 + scCoin, wsc: Math.random() * 200, bsc: Math.random() * 100 } }),
            status: txType.status,
            country_code: 'US',
            transaction_id: null, // Will be auto-generated
            transaction_date_time: dates[d],
            transaction_type: txType.type,
            is_success: txType.isSuccess,
            payment_transaction_id: `demo-banking-${bankingCounter++}-${Date.now()}`,
            payment_method: paymentMethods[d % paymentMethods.length],
            more_details: JSON.stringify({
              source: 'demo_seeder',
              description: `Demo ${txType.type} transaction`,
              ip: '192.168.1.' + (i + 1)
            }),
            is_first_deposit: isDeposit && d === 0 && i === 0,
            elastic_updated: false,
            package_id: isDeposit ? 1 : null,
            promocode_id: 0,
            bonus_sc: isDeposit ? scCoin * 0.1 : 0,
            bonus_gc: isDeposit ? gcCoin * 0.1 : 0,
            promocode_bonus_sc: 0,
            promocode_bonus_gc: 0,
            promocode_discount: 0,
            created_at: dates[d],
            updated_at: dates[d]
          })
        }
      }

      await queryInterface.bulkInsert('transaction_bankings', bankingTransactions, {})
      console.log(`Inserted ${bankingTransactions.length} demo banking transactions`)
    }

    // ========================================
    // 3. Update Wallet Vault Balances (for Vault section)
    // ========================================
    // Update existing wallets to have vault balances
    for (const user of usersWithWallets.slice(0, 5)) {
      if (!user.walletId) continue

      const vaultGc = (Math.random() * 50000 + 5000).toFixed(2)
      const vaultSc = {
        psc: (Math.random() * 100 + 10).toFixed(2),
        wsc: (Math.random() * 50 + 5).toFixed(2),
        bsc: (Math.random() * 20 + 2).toFixed(2)
      }

      await queryInterface.sequelize.query(
        `UPDATE wallets 
         SET vault_gc_coin = :vaultGc,
             vault_sc_coin = :vaultSc,
             updated_at = :now
         WHERE wallet_id = :walletId
           AND (vault_gc_coin IS NULL OR vault_gc_coin = 0);`,
        {
          replacements: {
            vaultGc: parseFloat(vaultGc),
            vaultSc: JSON.stringify(vaultSc),
            now,
            walletId: user.walletId
          }
        }
      )
    }
    console.log('Updated wallet vault balances for demo users')

    // ========================================
    // 4. Additional Redeem Requests (Pending for Redeem Requests section)
    // ========================================
    const existingPendingRedeems = await queryInterface.sequelize.query(
      `SELECT transaction_banking_id AS "id" FROM transaction_bankings 
       WHERE transaction_type = 'redeem' AND status = 0 
       AND payment_transaction_id LIKE 'demo-redeem-%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingPendingRedeems.length === 0) {
      const pendingRedeems = []
      let redeemCounter = 1

      for (let i = 0; i < Math.min(usersWithWallets.length, 5); i++) {
        const user = usersWithWallets[i]
        if (!user.walletId) continue

        const amount = (Math.random() * 150 + 25).toFixed(2)
        const dates = [now, oneDayAgo, threeDaysAgo]

        for (const date of dates.slice(0, 2)) {
          pendingRedeems.push({
            actionee_type: 'user',
            actionee_id: user.userId,
            actionee_email: user.email,
            actionee_name: user.firstName || 'Demo User',
            wallet_id: user.walletId,
            currency_code: user.currencyCode || 'USD',
            amount: parseFloat(amount),
            gc_coin: 0,
            sc_coin: parseFloat(amount),
            before_balance: JSON.stringify({ gc: Math.random() * 100000, sc: { psc: Math.random() * 500, wsc: parseFloat(amount) + 50, bsc: 0 } }),
            after_balance: JSON.stringify({ gc: Math.random() * 100000, sc: { psc: Math.random() * 500, wsc: 50, bsc: 0 } }),
            status: TRANSACTION_STATUS.PENDING,
            country_code: 'US',
            transaction_date_time: date,
            transaction_type: 'redeem',
            is_success: false,
            payment_transaction_id: `demo-redeem-${redeemCounter++}-${Date.now()}`,
            payment_method: 'bank_transfer',
            more_details: JSON.stringify({
              source: 'demo_seeder',
              description: 'Demo pending redemption request',
              bankName: 'Demo Bank',
              accountLast4: '1234',
              requestedAt: date.toISOString()
            }),
            is_first_deposit: false,
            elastic_updated: false,
            promocode_id: 0,
            bonus_sc: 0,
            bonus_gc: 0,
            promocode_bonus_sc: 0,
            promocode_bonus_gc: 0,
            promocode_discount: 0,
            created_at: date,
            updated_at: date
          })
        }
      }

      if (pendingRedeems.length > 0) {
        await queryInterface.bulkInsert('transaction_bankings', pendingRedeems, {})
        console.log(`Inserted ${pendingRedeems.length} pending redeem requests`)
      }
    }

    console.log('Transactions demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove demo casino transactions
    await queryInterface.sequelize.query(
      `DELETE FROM casino_transactions WHERE transaction_id LIKE 'demo-tx-%';`
    )

    // Remove demo banking transactions
    await queryInterface.sequelize.query(
      `DELETE FROM transaction_bankings WHERE payment_transaction_id LIKE 'demo-banking-%';`
    )

    // Remove demo redeem requests
    await queryInterface.sequelize.query(
      `DELETE FROM transaction_bankings WHERE payment_transaction_id LIKE 'demo-redeem-%';`
    )

    // Reset vault balances (optional - be careful with this in production)
    // await queryInterface.sequelize.query(
    //   `UPDATE wallets SET vault_gc_coin = 0, vault_sc_coin = '{"psc":0,"wsc":0,"bsc":0}' WHERE vault_gc_coin > 0;`
    // )

    console.log('Transactions demo data removed')
  }
}
