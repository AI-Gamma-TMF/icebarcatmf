'use strict'

// Demo data for Admin -> AMOE Bonus dashboard & history
// Endpoints:
// - GET /api/v1/amoe/graph-data (uses scanned_date, registered_date, created_at, status=SUCCESS, more_details.gcAmount/scAmount)
// - GET /api/v1/amoe/history (filters by created_at range + status=SUCCESS when date filters are used)

const { QueryTypes } = require('sequelize')

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

      const demoUsers = await queryInterface.sequelize.query(
        `
        SELECT user_id AS "userId", email
        FROM users
        WHERE email IN (:emails)
        ORDER BY user_id ASC;
        `,
        { type: QueryTypes.SELECT, transaction, replacements: { emails: demoEmails } }
      )

      if (!demoUsers?.length) {
        await transaction.commit()
        return
      }

      // Cleanup (idempotent)
      await queryInterface.sequelize.query(
        `DELETE FROM amoe WHERE (more_details->>'seed') = 'demo';`,
        { transaction }
      )

      // Statuses from constant.js:
      // PENDING: 0, SUCCESS: 1, FAILED: 2
      const SUCCESS = 1
      const PENDING = 0
      const FAILED = 2

      const rows = []
      demoUsers.forEach((u, idx) => {
        // Spread activity across last ~10 days so dashboard default range has data.
        const d1 = 2 + idx
        const d2 = 6 + idx
        const d3 = 9 + idx

        // Success (claimed) entry
        rows.push({
          user_id: u.userId,
          email: u.email,
          entry_id: `DEMO-AMOE-${u.userId}-${Date.now()}-${idx}`,
          status: SUCCESS,
          scanned_date: daysAgo(d2),
          registered_date: daysAgo(d1),
          remark: 'Demo AMOE bonus (claimed)',
          more_details: asJsonbLiteral({
            seed: 'demo',
            scAmount: String(5 + idx * 2),
            gcAmount: String(10 + idx * 3)
          }),
          created_at: daysAgo(d1),
          updated_at: daysAgo(d1)
        })

        // Pending (scanned but not yet claimed)
        rows.push({
          user_id: u.userId,
          email: u.email,
          entry_id: `DEMO-AMOE-PENDING-${u.userId}-${idx}`,
          status: PENDING,
          scanned_date: daysAgo(d3),
          registered_date: null,
          remark: 'Demo AMOE entry (pending)',
          more_details: asJsonbLiteral({ seed: 'demo', scAmount: '0', gcAmount: '0' }),
          created_at: daysAgo(d3),
          updated_at: daysAgo(d3)
        })

        // Failed (scanned but rejected)
        rows.push({
          user_id: u.userId,
          email: u.email,
          entry_id: `DEMO-AMOE-FAILED-${u.userId}-${idx}`,
          status: FAILED,
          scanned_date: daysAgo(d3 - 1),
          registered_date: null,
          remark: 'Demo AMOE entry (failed validation)',
          more_details: asJsonbLiteral({ seed: 'demo', scAmount: '0', gcAmount: '0' }),
          created_at: daysAgo(d3 - 1),
          updated_at: daysAgo(d3 - 1)
        })
      })

      await queryInterface.bulkInsert('amoe', rows, { transaction })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        `DELETE FROM amoe WHERE (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}

