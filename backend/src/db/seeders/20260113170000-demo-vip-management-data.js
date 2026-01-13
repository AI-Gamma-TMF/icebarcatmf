'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for VIP Management sections:
// - Dashboard (GET /api/v1/vip/dashboard-report) -> user_internal_rating + whale_players + transaction_bankings
// - Pending VIP (GET /api/v1/vip?userType=pending) -> user_internal_rating where vipStatus='pending'
// - Customer Management (GET /api/v1/vip?userType=vip) -> user_internal_rating where vipStatus='approved'
// - VIP Questions (GET /api/v1/vip/questionnaire) -> questionnaire table
// - Commission Report (GET /api/v1/vip/manager) -> vip_manager_assignments + admin_users
//
// This seeder is idempotent: it checks for existing demo data before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get existing users to make them VIP
    const users = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId", email, first_name AS "firstName", last_name AS "lastName"
       FROM users
       ORDER BY user_id ASC
       LIMIT 10;`,
      { type: QueryTypes.SELECT }
    )
    if (users.length < 3) {
      console.log('Not enough users to create VIP demo data, skipping...')
      return
    }

    // Get an admin user for VIP manager assignment
    const adminUsers = await queryInterface.sequelize.query(
      `SELECT admin_user_id AS "adminUserId", email, first_name AS "firstName"
       FROM admin_users
       WHERE is_active = true
       ORDER BY admin_user_id ASC
       LIMIT 3;`,
      { type: QueryTypes.SELECT }
    )
    const demoManagerId = adminUsers?.[0]?.adminUserId

    // Check if demo VIP questionnaire already exists
    const existingQuestionnaire = await queryInterface.sequelize.query(
      `SELECT questionnaire_id AS "id" FROM questionnaire WHERE question LIKE 'Demo VIP%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    // ========================================
    // 1. VIP Questions (questionnaire table)
    // ========================================
    if (existingQuestionnaire.length === 0) {
      const demoQuestions = [
        {
          question: 'Demo VIP: What is your preferred gaming category?',
          options: JSON.stringify(['Slots', 'Table Games', 'Live Casino', 'Sports', 'All of the above']),
          question_type: 'single_choice',
          frontend_question_type: 'radio',
          required: true,
          more_details: JSON.stringify({ category: 'preferences', weight: 10 }),
          is_active: true,
          order_id: 1,
          created_at: now,
          updated_at: now
        },
        {
          question: 'Demo VIP: How often do you play per week?',
          options: JSON.stringify(['Daily', '3-5 times', '1-2 times', 'Occasionally']),
          question_type: 'single_choice',
          frontend_question_type: 'radio',
          required: true,
          more_details: JSON.stringify({ category: 'frequency', weight: 15 }),
          is_active: true,
          order_id: 2,
          created_at: now,
          updated_at: now
        },
        {
          question: 'Demo VIP: What is your average session duration?',
          options: JSON.stringify(['Less than 30 minutes', '30 min - 1 hour', '1-2 hours', 'More than 2 hours']),
          question_type: 'single_choice',
          frontend_question_type: 'radio',
          required: true,
          more_details: JSON.stringify({ category: 'engagement', weight: 12 }),
          is_active: true,
          order_id: 3,
          created_at: now,
          updated_at: now
        },
        {
          question: 'Demo VIP: Rate your overall experience (1-10)',
          options: JSON.stringify({ min: 1, max: 10 }),
          question_type: 'rating',
          frontend_question_type: 'slider',
          required: false,
          more_details: JSON.stringify({ category: 'satisfaction', weight: 8 }),
          is_active: true,
          order_id: 4,
          created_at: now,
          updated_at: now
        },
        {
          question: 'Demo VIP: Any additional feedback?',
          options: null,
          question_type: 'text',
          frontend_question_type: 'textarea',
          required: false,
          more_details: JSON.stringify({ category: 'feedback', weight: 5 }),
          is_active: true,
          order_id: 5,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('questionnaire', demoQuestions, {})
      console.log(`Inserted ${demoQuestions.length} demo VIP questions`)
    }

    // ========================================
    // 2. User Internal Rating (VIP status for users)
    // ========================================
    // Check existing ratings
    const existingRatings = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId" FROM user_internal_rating WHERE user_id IN (:userIds);`,
      { type: QueryTypes.SELECT, replacements: { userIds: users.map(u => u.userId) } }
    )
    const existingRatingUserIds = new Set(existingRatings.map(r => r.userId))

    // Create VIP ratings for users who don't have one
    const vipStatuses = ['approved', 'approved', 'approved', 'pending', 'pending', 'revoked', 'approved', 'pending', 'approved', 'approved']
    const ratings = [5, 4, 5, 3, 4, 2, 4, 3, 5, 4]
    const scores = [95.5, 82.3, 91.0, 65.2, 78.9, 45.0, 88.5, 72.1, 93.2, 85.7]

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      if (existingRatingUserIds.has(user.userId)) continue

      const vipStatus = vipStatuses[i] || 'pending'
      const rating = ratings[i] || 3
      const score = scores[i] || 50.0

      await queryInterface.bulkInsert('user_internal_rating', [{
        user_id: user.userId,
        rating,
        score,
        vip_status: vipStatus,
        comment: `Demo VIP user - ${vipStatus} status`,
        more_details: JSON.stringify({
          totalPurchases: Math.floor(Math.random() * 50000) + 5000,
          totalRedemptions: Math.floor(Math.random() * 20000) + 1000,
          lastActivity: now.toISOString(),
          preferredGames: ['Slots', 'Blackjack']
        }),
        managed_by: demoManagerId || null,
        vip_approved_date: vipStatus === 'approved' ? thirtyDaysAgo : null,
        vip_revoked_date: vipStatus === 'revoked' ? sevenDaysAgo : null,
        managed_by_assignment_date: demoManagerId ? thirtyDaysAgo : null,
        created_at: now,
        updated_at: now
      }], {})
    }
    console.log('Inserted/updated user_internal_rating for VIP users')

    // ========================================
    // 3. VIP Manager Assignments (for Commission Report)
    // ========================================
    if (demoManagerId) {
      // Check existing assignments
      const existingAssignments = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM vip_manager_assignments WHERE manager_id = :managerId;`,
        { type: QueryTypes.SELECT, replacements: { managerId: demoManagerId } }
      )
      const existingAssignmentUserIds = new Set(existingAssignments.map(a => a.userId))

      // Assign VIP users to manager
      const approvedVipUsers = users.filter((u, i) => vipStatuses[i] === 'approved' && !existingAssignmentUserIds.has(u.userId))

      for (const user of approvedVipUsers) {
        await queryInterface.bulkInsert('vip_manager_assignments', [{
          user_id: user.userId,
          manager_id: demoManagerId,
          start_date: thirtyDaysAgo,
          end_date: null, // Still active
          created_at: now,
          updated_at: now
        }], {})
      }
      console.log(`Assigned ${approvedVipUsers.length} VIP users to manager`)
    }

    // ========================================
    // 4. Whale Players (for Dashboard stats)
    // ========================================
    // Check existing whale player entries
    const existingWhales = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId" FROM whale_players WHERE user_id IN (:userIds) LIMIT 1;`,
      { type: QueryTypes.SELECT, replacements: { userIds: users.map(u => u.userId) } }
    )

    if (existingWhales.length === 0) {
      const whaleData = []
      const timestamps = [
        now,
        new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Week ago
        new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Month ago
      ]

      for (const user of users.slice(0, 5)) { // Top 5 users as whales
        for (const timestamp of timestamps) {
          whaleData.push({
            user_id: user.userId,
            timestamp,
            total_purchase_amount: Math.floor(Math.random() * 10000) + 1000,
            purchase_count: Math.floor(Math.random() * 20) + 5,
            total_redemption_amount: Math.floor(Math.random() * 5000) + 500,
            redemption_count: Math.floor(Math.random() * 10) + 2,
            admin_bonus: Math.floor(Math.random() * 500) + 50,
            site_bonus_deposit: Math.floor(Math.random() * 300) + 30,
            site_bonus: Math.floor(Math.random() * 200) + 20,
            total_pending_redemption_amount: Math.floor(Math.random() * 1000),
            pending_redemption_count: Math.floor(Math.random() * 3),
            cancelled_redemption_count: Math.floor(Math.random() * 2),
            total_sc_bet_amount: Math.floor(Math.random() * 50000) + 5000,
            total_sc_win_amount: Math.floor(Math.random() * 40000) + 4000,
            vip_questionnaire_bonus_count: Math.floor(Math.random() * 5),
            vip_questionnaire_bonus_amount: Math.floor(Math.random() * 100) + 10,
            managed_by: demoManagerId || null
          })
        }
      }

      await queryInterface.bulkInsert('whale_players', whaleData, {})
      console.log(`Inserted ${whaleData.length} whale player records`)
    }

    // ========================================
    // 5. User Questionnaire Answers (for VIP Questions section)
    // ========================================
    const questionnaireIds = await queryInterface.sequelize.query(
      `SELECT questionnaire_id AS "id" FROM questionnaire WHERE question LIKE 'Demo VIP%' ORDER BY order_id;`,
      { type: QueryTypes.SELECT }
    )

    if (questionnaireIds.length > 0) {
      // Check existing answers
      const existingAnswers = await queryInterface.sequelize.query(
        `SELECT user_id AS "userId" FROM user_questionnaire_answer 
         WHERE questionnaire_id IN (:qIds) LIMIT 1;`,
        { type: QueryTypes.SELECT, replacements: { qIds: questionnaireIds.map(q => q.id) } }
      )

      if (existingAnswers.length === 0) {
        const answers = []
        const sampleAnswers = [
          ['Slots', 'Table Games', 'Live Casino'],
          ['Daily', '3-5 times', '1-2 times'],
          ['1-2 hours', '30 min - 1 hour', 'More than 2 hours'],
          [8, 9, 7, 10],
          ['Great experience!', 'Love the VIP benefits', 'Would recommend to friends']
        ]

        for (let i = 0; i < Math.min(users.length, 5); i++) {
          const user = users[i]
          for (let j = 0; j < questionnaireIds.length; j++) {
            const qId = questionnaireIds[j].id
            const answerOptions = sampleAnswers[j] || ['N/A']
            const answer = answerOptions[i % answerOptions.length]

            answers.push({
              user_id: user.userId,
              questionnaire_id: qId,
              answer: JSON.stringify({ value: answer }),
              created_at: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              updated_at: now
            })
          }
        }

        await queryInterface.bulkInsert('user_questionnaire_answer', answers, {})
        console.log(`Inserted ${answers.length} questionnaire answers`)
      }
    }

    // ========================================
    // 6. Tiers (for Loyalty Tier section if empty)
    // ========================================
    const existingTiers = await queryInterface.sequelize.query(
      `SELECT tier_id AS "id" FROM tiers LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingTiers.length === 0) {
      const tiers = [
        { name: 'Bronze', required_xp: 0, bonus_gc: 1000, bonus_sc: 1, weekly_bonus_percentage: 0.5, monthly_bonus_percentage: 1.0, level: 1, is_active: true, icon: 'bronze-tier.png', created_at: now, updated_at: now, is_weekely_bonus_active: true, is_monthly_bonus_active: true },
        { name: 'Silver', required_xp: 1000, bonus_gc: 2500, bonus_sc: 2.5, weekly_bonus_percentage: 1.0, monthly_bonus_percentage: 2.0, level: 2, is_active: true, icon: 'silver-tier.png', created_at: now, updated_at: now, is_weekely_bonus_active: true, is_monthly_bonus_active: true },
        { name: 'Gold', required_xp: 5000, bonus_gc: 5000, bonus_sc: 5, weekly_bonus_percentage: 1.5, monthly_bonus_percentage: 3.0, level: 3, is_active: true, icon: 'gold-tier.png', created_at: now, updated_at: now, is_weekely_bonus_active: true, is_monthly_bonus_active: true },
        { name: 'Platinum', required_xp: 15000, bonus_gc: 10000, bonus_sc: 10, weekly_bonus_percentage: 2.0, monthly_bonus_percentage: 4.0, level: 4, is_active: true, icon: 'platinum-tier.png', created_at: now, updated_at: now, is_weekely_bonus_active: true, is_monthly_bonus_active: true },
        { name: 'Diamond', required_xp: 50000, bonus_gc: 25000, bonus_sc: 25, weekly_bonus_percentage: 3.0, monthly_bonus_percentage: 5.0, level: 5, is_active: true, icon: 'diamond-tier.png', created_at: now, updated_at: now, is_weekely_bonus_active: true, is_monthly_bonus_active: true }
      ]

      await queryInterface.bulkInsert('tiers', tiers, {})
      console.log(`Inserted ${tiers.length} loyalty tiers`)

      // Assign users to tiers
      const insertedTiers = await queryInterface.sequelize.query(
        `SELECT tier_id AS "id", level FROM tiers ORDER BY level;`,
        { type: QueryTypes.SELECT }
      )

      const userTiers = []
      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        const tierIndex = Math.min(i % insertedTiers.length, insertedTiers.length - 1)
        const tier = insertedTiers[tierIndex]

        userTiers.push({
          tier_id: tier.id,
          user_id: user.userId,
          level: tier.level,
          max_level: 5,
          sc_spend: Math.floor(Math.random() * 10000) + 500,
          gc_spend: Math.floor(Math.random() * 100000) + 5000,
          created_at: now,
          updated_at: now,
          promoted_tier_level: 0,
          more_details: JSON.stringify({ lastTierUp: thirtyDaysAgo.toISOString() })
        })
      }

      await queryInterface.bulkInsert('users_tiers', userTiers, {})
      console.log(`Assigned ${userTiers.length} users to tiers`)
    }

    console.log('VIP Management demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove demo questionnaire answers
    await queryInterface.sequelize.query(
      `DELETE FROM user_questionnaire_answer 
       WHERE questionnaire_id IN (SELECT questionnaire_id FROM questionnaire WHERE question LIKE 'Demo VIP%');`
    )

    // Remove demo questionnaires
    await queryInterface.sequelize.query(
      `DELETE FROM questionnaire WHERE question LIKE 'Demo VIP%';`
    )

    // Remove demo whale players (be careful - only remove if comment indicates demo)
    // We don't delete whale_players as they may have real data

    // Remove VIP manager assignments for demo users
    // We don't delete vip_manager_assignments as they may have real data

    // Remove demo user internal ratings (be careful)
    await queryInterface.sequelize.query(
      `DELETE FROM user_internal_rating WHERE comment LIKE 'Demo VIP%';`
    )

    console.log('VIP Management demo data removed')
  }
}
