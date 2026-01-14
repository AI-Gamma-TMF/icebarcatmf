'use strict'

// Demo data for Admin -> Tournaments list (/api/v1/tournament)
// The listing defaults to status="1" (RUNNING), so we seed at least one running tournament.

module.exports = {
  async up (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const now = new Date()
      const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000)

      const asJsonbLiteral = (obj) =>
        queryInterface.sequelize.literal(`'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`)

      // Cleanup (idempotent)
      await queryInterface.sequelize.query(
        `DELETE FROM tournament WHERE (more_details->>'seed') = 'demo';`,
        { transaction }
      )

      const demoTournaments = [
        {
          title: 'Demo Tournament — On-Going',
          description: 'Demo tournament seeded for the admin dashboard.',
          entry_amount: 5.0,
          entry_coin: 'SC',
          start_date: daysFromNow(-1),
          end_date: daysFromNow(1),
          // Stored as string in DB; UI sends "0/1/2/3"
          status: '1',
          order_id: 1,
          winner_percentages: queryInterface.sequelize.literal(`ARRAY[60,30,10]::float[]`),
          more_details: asJsonbLiteral({ seed: 'demo' }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo Tournament — Upcoming',
          description: 'Upcoming demo tournament seeded for the admin dashboard.',
          entry_amount: 2.5,
          entry_coin: 'SC',
          start_date: daysFromNow(2),
          end_date: daysFromNow(5),
          status: '0',
          order_id: 2,
          winner_percentages: queryInterface.sequelize.literal(`ARRAY[100]::float[]`),
          more_details: asJsonbLiteral({ seed: 'demo' }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo Tournament — Completed',
          description: 'Completed demo tournament seeded for the admin dashboard.',
          entry_amount: 1.0,
          entry_coin: 'SC',
          start_date: daysFromNow(-14),
          end_date: daysFromNow(-10),
          status: '2',
          order_id: 3,
          winner_percentages: queryInterface.sequelize.literal(`ARRAY[70,20,10]::float[]`),
          more_details: asJsonbLiteral({ seed: 'demo' }),
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('tournament', demoTournaments, { transaction })
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
        `DELETE FROM tournament WHERE (more_details->>'seed') = 'demo';`,
        { transaction }
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}

