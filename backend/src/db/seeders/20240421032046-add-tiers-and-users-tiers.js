'use strict'

const { updateUsersTierJobScheduler } = require('../../utils/common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // make sure table's has no data present.
    await queryInterface.bulkDelete('tiers', null)
    await queryInterface.bulkDelete('users_tiers', null)

    // Insert New Tiers
    await queryInterface.bulkInsert(
      {
        tableName: 'tiers',
        schema: 'public'
      },
      [
        {
          name: 'Nexus',
          required_xp: 0,
          bonus_gc: 0,
          bonus_sc: 0,
          weekly_bonus_percentage: 0,
          monthly_bonus_percentage: 1,
          level: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Mint',
          required_xp: 5000,
          bonus_gc: 10000,
          bonus_sc: 10,
          weekly_bonus_percentage: 1,
          monthly_bonus_percentage: 3,
          level: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Valut',
          required_xp: 25000,
          bonus_gc: 20000,
          bonus_sc: 20,
          weekly_bonus_percentage: 2,
          monthly_bonus_percentage: 4,
          level: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Forge',
          required_xp: 50000,
          bonus_gc: 30000,
          bonus_sc: 30,
          weekly_bonus_percentage: 3,
          monthly_bonus_percentage: 4,
          level: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Reserve',
          required_xp: 100000,
          bonus_gc: 40000,
          bonus_sc: 40,
          weekly_bonus_percentage: 4,
          monthly_bonus_percentage: 5,
          level: 5,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Empire',
          required_xp: 250000,
          bonus_gc: 50000,
          bonus_sc: 50,
          weekly_bonus_percentage: 5,
          monthly_bonus_percentage: 6,
          level: 6,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    )

    const usersData = await queryInterface.sequelize.query(`
    SELECT
        u.user_id AS "userId",
        ROUND(COALESCE(SUM(CASE WHEN ct.amount_type = 0 THEN amount END)::numeric, 0), 2) AS "gcSum",
        ROUND(COALESCE(SUM(CASE WHEN ct.amount_type = 1 THEN amount END)::numeric, 0), 2) AS "scSum",
        t.tier_id AS "tierId"
      FROM
          public.users u
      LEFT JOIN public.casino_transactions ct ON u.user_id = ct.user_id AND ct.action_type = 'bet'
      CROSS JOIN public.tiers t
      WHERE t.level = 1
      GROUP BY
          "userId", "tierId"
      ORDER BY
          "userId";`)

    const usersTierData = []

    usersData[0].map(user => {
      return usersTierData.push({
        tier_id: +user.tierId,
        user_id: +user.userId,
        level: 1,
        max_level: 1,
        sc_spend: +user.scSum,
        gc_spend: +user.gcSum,
        created_at: new Date(),
        updated_at: new Date()
      })
    })

    if (usersTierData.length > 0) {
      await queryInterface.bulkInsert(
        {
          tableName: 'users_tiers',
          schema: 'public'
        },
        usersTierData
      )
    }

    // Make sure Users are updated to there respected tiers.
    try {
      await updateUsersTierJobScheduler()
      console.log('Job Added Successfully')
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tiers', null)
    await queryInterface.bulkDelete('users_tiers', null)
  }
}
