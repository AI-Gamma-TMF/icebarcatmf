'use strict'

const { QueryTypes } = require('sequelize')

// Comprehensive demo data seeder for ALL remaining admin panel sections:
// - Tournaments
// - Tiers (Loyalty)
// - Giveaways/Raffles
// - CMS
// - Email Center/Templates
// - Bonus
// - Affiliate
// - AMOE Bonus
// - PromoCode (Affiliate & Purchase)
// - CRM Promotion
// - Export Center
// - Notification Center
// - Domain Blocking
// - Promocode Blocking
// - Promotion Management
// - Maintenance Mode
//
// This seeder is idempotent: it checks for existing demo data before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // This seeder is used on demo deployments where DB schemas can drift.
    // Never fail the entire deploy due to one missing table/column.
    const safeSection = async (name, fn) => {
      try {
        await fn()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[DEMO SEED] Skipping "${name}" due to error: ${err?.message || err}`)
      }
    }

    // Fetch demo user and admin
    const userRow = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId", email FROM users ORDER BY user_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    const demoUserId = userRow?.[0]?.userId
    const demoUserEmail = userRow?.[0]?.email || 'demouser@example.com'

    const adminRow = await queryInterface.sequelize.query(
      `SELECT admin_user_id AS "adminUserId" FROM admin_users ORDER BY admin_user_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    const demoAdminId = adminRow?.[0]?.adminUserId

    // Fetch a demo game for tournaments/raffles
    const gameRow = await queryInterface.sequelize.query(
      `SELECT master_casino_game_id AS "gameId" FROM master_casino_games ORDER BY master_casino_game_id ASC LIMIT 3;`,
      { type: QueryTypes.SELECT }
    )
    const demoGameIds = gameRow?.map(g => g.gameId) || []

    // ========================================
    // 1. TOURNAMENTS
    // ========================================
    const existingTournaments = await queryInterface.sequelize.query(
      `SELECT tournament_id FROM tournament WHERE title LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingTournaments.length === 0) {
      const tournaments = [
        {
          title: 'Demo: Weekly Slots Championship',
          description: 'Compete in our weekly slots tournament for amazing prizes! Play any qualifying slot game and climb the leaderboard.',
          entry_amount: 0,
          entry_coin: 'SC',
          start_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? demoGameIds : null,
          // NOTE: `tournament.win_gc` / `tournament.win_sc` are DOUBLE columns (not JSON).
          // Store numeric totals, and keep the per-rank breakdown in JSON (`more_details`).
          win_gc: 175000, // 100000 + 50000 + 25000
          win_sc: 175, // 100 + 50 + 25
          player_limit: 1000,
          vip_tournament: false,
          total_win: 0,
          total_bet: 0,
          order_id: 1,
          status: 'active',
          winner_percentages: [50, 30, 20],
          image_url: 'https://example.com/tournament-slots.jpg',
          is_subscriber_only: false,
          more_details: JSON.stringify({
            prize_breakdown_gc: { 1: 100000, 2: 50000, 3: 25000 },
            prize_breakdown_sc: { 1: 100, 2: 50, 3: 25 }
          }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: VIP High Roller Event',
          description: 'Exclusive tournament for VIP players. Higher stakes, bigger rewards!',
          entry_amount: 10,
          entry_coin: 'SC',
          start_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? demoGameIds : null,
          win_gc: 850000, // 500000 + 250000 + 100000
          win_sc: 850, // 500 + 250 + 100
          player_limit: 100,
          vip_tournament: true,
          total_win: 0,
          total_bet: 0,
          order_id: 2,
          status: 'active',
          winner_percentages: [60, 25, 15],
          image_url: 'https://example.com/tournament-vip.jpg',
          is_subscriber_only: false,
          more_details: JSON.stringify({
            prize_breakdown_gc: { 1: 500000, 2: 250000, 3: 100000 },
            prize_breakdown_sc: { 1: 500, 2: 250, 3: 100 }
          }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Subscriber Exclusive Sprint',
          description: 'Quick 24-hour tournament exclusively for subscribers!',
          entry_amount: 0,
          entry_coin: 'GC',
          start_date: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 12 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? [demoGameIds[0]] : null,
          win_gc: 350000, // 200000 + 100000 + 50000
          win_sc: 85, // 50 + 25 + 10
          player_limit: 500,
          vip_tournament: false,
          total_win: 0,
          total_bet: 0,
          order_id: 3,
          status: 'active',
          winner_percentages: [50, 30, 20],
          image_url: 'https://example.com/tournament-subscriber.jpg',
          is_subscriber_only: true,
          more_details: JSON.stringify({
            prize_breakdown_gc: { 1: 200000, 2: 100000, 3: 50000 },
            prize_breakdown_sc: { 1: 50, 2: 25, 3: 10 }
          }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Past Tournament (Completed)',
          description: 'This tournament has ended. Check out the winners!',
          entry_amount: 5,
          entry_coin: 'SC',
          start_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? demoGameIds : null,
          win_gc: 260000, // 150000 + 75000 + 35000
          win_sc: 125, // 75 + 35 + 15
          player_limit: 500,
          vip_tournament: false,
          total_win: 125,
          total_bet: 500,
          order_id: 99,
          status: 'completed',
          winner_percentages: [50, 30, 20],
          image_url: 'https://example.com/tournament-past.jpg',
          is_subscriber_only: false,
          more_details: JSON.stringify({
            prize_breakdown_gc: { 1: 150000, 2: 75000, 3: 35000 },
            prize_breakdown_sc: { 1: 75, 2: 35, 3: 15 }
          }),
          created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      ]

      await queryInterface.bulkInsert('tournament', tournaments, {})
      console.log(`Inserted ${tournaments.length} demo tournaments`)
    }

    // ========================================
    // 2. TIERS (Loyalty)
    // ========================================
    const existingTiers = await queryInterface.sequelize.query(
      `SELECT tier_id FROM tiers WHERE name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingTiers.length === 0) {
      const tiers = [
        { name: 'Demo: Bronze', required_xp: 0, bonus_gc: 10000, bonus_sc: 10, weekly_bonus_percentage: 0.01, monthly_bonus_percentage: 0.02, level: 1, is_active: true, icon: 'bronze.png', is_weekely_bonus_active: true, is_monthly_bonus_active: true, created_at: now, updated_at: now },
        { name: 'Demo: Silver', required_xp: 100, bonus_gc: 50000, bonus_sc: 50, weekly_bonus_percentage: 0.02, monthly_bonus_percentage: 0.04, level: 2, is_active: true, icon: 'silver.png', is_weekely_bonus_active: true, is_monthly_bonus_active: true, created_at: now, updated_at: now },
        { name: 'Demo: Gold', required_xp: 500, bonus_gc: 100000, bonus_sc: 100, weekly_bonus_percentage: 0.03, monthly_bonus_percentage: 0.06, level: 3, is_active: true, icon: 'gold.png', is_weekely_bonus_active: true, is_monthly_bonus_active: true, created_at: now, updated_at: now },
        { name: 'Demo: Platinum', required_xp: 2000, bonus_gc: 250000, bonus_sc: 250, weekly_bonus_percentage: 0.04, monthly_bonus_percentage: 0.08, level: 4, is_active: true, icon: 'platinum.png', is_weekely_bonus_active: true, is_monthly_bonus_active: true, created_at: now, updated_at: now },
        { name: 'Demo: Diamond', required_xp: 10000, bonus_gc: 1000000, bonus_sc: 1000, weekly_bonus_percentage: 0.05, monthly_bonus_percentage: 0.10, level: 5, is_active: true, icon: 'diamond.png', is_weekely_bonus_active: true, is_monthly_bonus_active: true, created_at: now, updated_at: now }
      ]

      await queryInterface.bulkInsert('tiers', tiers, {})
      console.log(`Inserted ${tiers.length} demo tiers`)
    }

    // ========================================
    // 3. GIVEAWAYS/RAFFLES
    // ========================================
    const existingRaffles = await queryInterface.sequelize.query(
      `SELECT raffle_id FROM raffles WHERE title LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingRaffles.length === 0) {
      const raffles = [
        {
          title: 'Demo: Monthly Grand Giveaway',
          sub_heading: 'Win Big This Month!',
          description: 'Play your favorite games and earn entries for our monthly grand prize draw!',
          wager_base_amt: 100,
          wager_base_amt_type: 'SC',
          start_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? demoGameIds : null,
          prize_amount_gc: 1000000,
          prize_amount_sc: 1000,
          image_url: 'https://example.com/raffle-grand.jpg',
          status: 'active',
          is_active: true,
          terms_and_conditions: 'Must be 18+ to participate. One entry per $1 wagered. Winners announced within 48 hours of draw.',
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Weekly Quick Draw',
          sub_heading: 'Fast Prizes Every Week!',
          description: 'Quick weekly raffle with instant prizes!',
          wager_base_amt: 25,
          wager_base_amt_type: 'SC',
          start_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? [demoGameIds[0]] : null,
          prize_amount_gc: 250000,
          prize_amount_sc: 250,
          image_url: 'https://example.com/raffle-weekly.jpg',
          status: 'active',
          is_active: true,
          terms_and_conditions: 'Standard terms apply.',
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Past Giveaway (Completed)',
          sub_heading: 'Congratulations to our winner!',
          description: 'This giveaway has ended.',
          wager_base_amt: 50,
          wager_base_amt_type: 'SC',
          start_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          end_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          game_id: demoGameIds.length > 0 ? demoGameIds : null,
          prize_amount_gc: 500000,
          prize_amount_sc: 500,
          image_url: 'https://example.com/raffle-past.jpg',
          winner_id: demoUserId || null,
          status: 'completed',
          is_active: false,
          won_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          terms_and_conditions: 'Standard terms apply.',
          created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }
      ]

      await queryInterface.bulkInsert('raffles', raffles, {})
      console.log(`Inserted ${raffles.length} demo raffles`)
    }

    // ========================================
    // 4. CMS PAGES
    // ========================================
    const existingCms = await queryInterface.sequelize.query(
      `SELECT cms_page_id FROM cms_pages WHERE slug LIKE 'demo-%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingCms.length === 0) {
      const cmsPages = [
        {
          title: JSON.stringify({ EN: 'Terms and Conditions' }),
          slug: 'demo-terms-and-conditions',
          content: JSON.stringify({ EN: '<h1>Terms and Conditions</h1><p>Welcome to our platform. By using our services, you agree to these terms...</p><h2>1. Acceptance of Terms</h2><p>By accessing this website, you accept these terms and conditions in full.</p><h2>2. Eligibility</h2><p>You must be at least 18 years old to use our services.</p>' }),
          category: 1,
          is_active: true,
          cms_type: 1,
          is_hidden: false,
          created_at: now,
          updated_at: now
        },
        {
          title: JSON.stringify({ EN: 'Privacy Policy' }),
          slug: 'demo-privacy-policy',
          content: JSON.stringify({ EN: '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p><h2>Data Collection</h2><p>We collect information you provide directly to us...</p>' }),
          category: 1,
          is_active: true,
          cms_type: 1,
          is_hidden: false,
          created_at: now,
          updated_at: now
        },
        {
          title: JSON.stringify({ EN: 'Responsible Gaming' }),
          slug: 'demo-responsible-gaming',
          content: JSON.stringify({ EN: '<h1>Responsible Gaming</h1><p>We are committed to promoting responsible gaming. Here are resources and tools to help you play responsibly.</p><h2>Set Limits</h2><p>You can set deposit, loss, and session limits in your account settings.</p>' }),
          category: 1,
          is_active: true,
          cms_type: 1,
          is_hidden: false,
          created_at: now,
          updated_at: now
        },
        {
          title: JSON.stringify({ EN: 'FAQ' }),
          slug: 'demo-faq',
          content: JSON.stringify({ EN: '<h1>Frequently Asked Questions</h1><h2>How do I create an account?</h2><p>Click the Sign Up button and follow the registration process.</p><h2>How do I make a deposit?</h2><p>Go to the Cashier section and select your preferred payment method.</p>' }),
          category: 2,
          is_active: true,
          cms_type: 2,
          is_hidden: false,
          created_at: now,
          updated_at: now
        },
        {
          title: JSON.stringify({ EN: 'About Us' }),
          slug: 'demo-about-us',
          content: JSON.stringify({ EN: '<h1>About Us</h1><p>We are a leading social casino platform dedicated to providing the best gaming experience.</p><h2>Our Mission</h2><p>To deliver entertainment and excitement to players worldwide.</p>' }),
          category: 1,
          is_active: true,
          cms_type: 1,
          is_hidden: false,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('cms_pages', cmsPages, {})
      console.log(`Inserted ${cmsPages.length} demo CMS pages`)
    }

    // ========================================
    // 5. EMAIL TEMPLATES
    // ========================================
    await safeSection('Email Templates', async () => {
      if (!demoAdminId) return

      // Some environments have an older `email_templates` schema without `label`.
      const cols = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_templates';`,
        { type: QueryTypes.SELECT }
      )
      const colNames = new Set((cols || []).map((c) => c.column_name))
      if (!colNames.has('label')) throw new Error('email_templates.label column missing')

      const existingEmailTemplates = await queryInterface.sequelize.query(
        `SELECT email_template_id FROM email_templates WHERE label LIKE 'Demo:%' LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingEmailTemplates.length === 0) {
        const emailTemplates = [
          {
            label: 'Demo: Welcome Email',
            type: 1,
            admin_id: demoAdminId,
            action_email_type: 'auto',
            is_primary: 1,
            dynamic_data: JSON.stringify(['firstName', 'email', 'bonusAmount']),
            template_code: JSON.stringify({ subject: 'Welcome to GammaSweep!', body: '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining us. Your account is now active.</p><p>As a welcome gift, you have received {{bonusAmount}} bonus coins!</p>' }),
            is_default: true,
            created_at: now,
            updated_at: now
          },
          {
            label: 'Demo: Password Reset',
            type: 2,
            admin_id: demoAdminId,
            action_email_type: 'auto',
            is_primary: 1,
            dynamic_data: JSON.stringify(['firstName', 'resetLink']),
            template_code: JSON.stringify({ subject: 'Reset Your Password', body: '<h1>Password Reset Request</h1><p>Hi {{firstName}},</p><p>Click the link below to reset your password:</p><a href="{{resetLink}}">Reset Password</a>' }),
            is_default: true,
            created_at: now,
            updated_at: now
          },
          {
            label: 'Demo: Deposit Confirmation',
            type: 3,
            admin_id: demoAdminId,
            action_email_type: 'auto',
            is_primary: 1,
            dynamic_data: JSON.stringify(['firstName', 'amount', 'gcCoins', 'scCoins', 'transactionId']),
            template_code: JSON.stringify({ subject: 'Deposit Confirmed!', body: '<h1>Deposit Successful</h1><p>Hi {{firstName}},</p><p>Your deposit of ${{amount}} has been processed.</p><p>You received: {{gcCoins}} GC and {{scCoins}} SC</p><p>Transaction ID: {{transactionId}}</p>' }),
            is_default: true,
            created_at: now,
            updated_at: now
          },
          {
            label: 'Demo: Redemption Approved',
            type: 4,
            admin_id: demoAdminId,
            action_email_type: 'auto',
            is_primary: 1,
            dynamic_data: JSON.stringify(['firstName', 'amount', 'method']),
            template_code: JSON.stringify({ subject: 'Redemption Approved!', body: '<h1>Good News!</h1><p>Hi {{firstName}},</p><p>Your redemption of ${{amount}} via {{method}} has been approved and is being processed.</p>' }),
            is_default: true,
            created_at: now,
            updated_at: now
          },
          {
            label: 'Demo: Promotional Newsletter',
            type: 5,
            admin_id: demoAdminId,
            action_email_type: 'manual',
            is_primary: 0,
            dynamic_data: JSON.stringify(['firstName', 'promoCode', 'expiryDate']),
            template_code: JSON.stringify({ subject: 'Special Offer Just For You!', body: '<h1>Exclusive Promotion</h1><p>Hi {{firstName}},</p><p>Use code {{promoCode}} for a special bonus! Valid until {{expiryDate}}.</p>' }),
            is_default: false,
            created_at: now,
            updated_at: now
          }
        ]

        await queryInterface.bulkInsert('email_templates', emailTemplates, {})
        console.log(`Inserted ${emailTemplates.length} demo email templates`)
      }
    })

    // ========================================
    // 6. BONUS
    // ========================================
    const existingBonus = await queryInterface.sequelize.query(
      `SELECT bonus_id FROM bonus WHERE bonus_name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingBonus.length === 0) {
      const bonuses = [
        {
          parent_type: 'system',
          bonus_name: 'Demo: Welcome Bonus',
          parent_id: 1,
          valid_from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          valid_to: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          promotion_title: JSON.stringify({ EN: 'Welcome Bonus - Double Your First Purchase!' }),
          bonus_type: 'deposit',
          term_condition: JSON.stringify({ EN: 'Available on first purchase only. 1x wagering requirement.' }),
          currency: JSON.stringify({ USD: true }),
          image_url: 'https://example.com/bonus-welcome.jpg',
          is_active: true,
          wagering_multiplier: 1,
          visible_in_promotions: true,
          claimed_count: 150,
          description: JSON.stringify({ EN: 'Get 100% bonus on your first purchase!' }),
          gc_amount: 50000,
          sc_amount: 50,
          is_unique: true,
          percentage: 100,
          minimum_purchase: 9.99,
          btn_text: 'Claim Now',
          created_at: now,
          updated_at: now
        },
        {
          parent_type: 'system',
          bonus_name: 'Demo: Daily Login Bonus',
          parent_id: 1,
          valid_from: now,
          valid_to: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          promotion_title: JSON.stringify({ EN: 'Daily Login Reward' }),
          bonus_type: 'freespins',
          term_condition: JSON.stringify({ EN: 'Login daily to claim. Resets at midnight UTC.' }),
          currency: JSON.stringify({ USD: true }),
          image_url: 'https://example.com/bonus-daily.jpg',
          is_active: true,
          wagering_multiplier: 1,
          visible_in_promotions: true,
          claimed_count: 5000,
          description: JSON.stringify({ EN: 'Free coins every day just for logging in!' }),
          gc_amount: 5000,
          sc_amount: 1,
          is_unique: false,
          btn_text: 'Claim Daily',
          created_at: now,
          updated_at: now
        },
        {
          parent_type: 'system',
          bonus_name: 'Demo: Weekend Special',
          parent_id: 1,
          valid_from: now,
          valid_to: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          promotion_title: JSON.stringify({ EN: 'Weekend Bonus Boost!' }),
          bonus_type: 'deposit',
          term_condition: JSON.stringify({ EN: 'Available Saturday and Sunday only.' }),
          currency: JSON.stringify({ USD: true }),
          image_url: 'https://example.com/bonus-weekend.jpg',
          is_active: true,
          wagering_multiplier: 2,
          valid_on_days: JSON.stringify(['Saturday', 'Sunday']),
          visible_in_promotions: true,
          claimed_count: 800,
          description: JSON.stringify({ EN: '50% extra on weekend purchases!' }),
          gc_amount: 25000,
          sc_amount: 25,
          is_unique: false,
          percentage: 50,
          minimum_purchase: 19.99,
          btn_text: 'Get Weekend Bonus',
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('bonus', bonuses, {})
      console.log(`Inserted ${bonuses.length} demo bonuses`)
    }

    // ========================================
    // 7. AFFILIATES
    // ========================================
    const existingAffiliates = await queryInterface.sequelize.query(
      `SELECT affiliate_id FROM affiliates WHERE email LIKE 'demo-affiliate%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingAffiliates.length === 0) {
      const affiliates = [
        {
          first_name: 'John',
          last_name: 'Partner',
          email: 'demo-affiliate1@example.com',
          is_active: true,
          phone_code: '+1',
          phone: '5551234567',
          date_of_birth: '1985-05-15',
          gender: 'male',
          address_line_1: '123 Partner Street',
          city: 'Las Vegas',
          state: 'NV',
          country: 'USA',
          zip_code: 89101,
          affiliate_status: 'approved',
          traffic_source: 'YouTube, Social Media',
          plan: 'Revenue Share 30%',
          is_terms_accepted: true,
          is_email_verified: true,
          created_at: now,
          updated_at: now
        },
        {
          first_name: 'Sarah',
          last_name: 'Influencer',
          email: 'demo-affiliate2@example.com',
          is_active: true,
          phone_code: '+1',
          phone: '5559876543',
          date_of_birth: '1990-08-22',
          gender: 'female',
          address_line_1: '456 Content Ave',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          zip_code: 90001,
          affiliate_status: 'approved',
          traffic_source: 'Instagram, TikTok',
          plan: 'CPA $50',
          is_terms_accepted: true,
          is_email_verified: true,
          created_at: now,
          updated_at: now
        },
        {
          first_name: 'Mike',
          last_name: 'Pending',
          email: 'demo-affiliate3@example.com',
          is_active: false,
          phone_code: '+1',
          phone: '5555555555',
          affiliate_status: 'pending',
          traffic_source: 'Website',
          is_terms_accepted: true,
          is_email_verified: false,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('affiliates', affiliates, {})
      console.log(`Inserted ${affiliates.length} demo affiliates`)
    }

    // ========================================
    // 8. AMOE BONUS
    // ========================================
    if (demoUserId) {
      const existingAmoe = await queryInterface.sequelize.query(
        `SELECT amoe_id FROM amoe WHERE entry_id LIKE 'DEMO-%' LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingAmoe.length === 0) {
        const amoeEntries = [
          {
            user_id: demoUserId,
            entry_id: 'DEMO-AMOE-001',
            email: demoUserEmail,
            status: 1, // Approved
            scanned_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            registered_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            remark: 'Approved - Valid mail-in entry',
            more_details: JSON.stringify({ source: 'mail', processedBy: 'admin' }),
            created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            updated_at: now
          },
          {
            user_id: demoUserId,
            entry_id: 'DEMO-AMOE-002',
            email: demoUserEmail,
            status: 0, // Pending
            scanned_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            registered_date: null,
            remark: null,
            more_details: JSON.stringify({ source: 'mail' }),
            created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            updated_at: now
          },
          {
            user_id: demoUserId,
            entry_id: 'DEMO-AMOE-003',
            email: demoUserEmail,
            status: 2, // Rejected
            scanned_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            registered_date: null,
            remark: 'Rejected - Duplicate entry',
            more_details: JSON.stringify({ source: 'mail', reason: 'duplicate' }),
            created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            updated_at: now
          }
        ]

        await queryInterface.bulkInsert('amoe', amoeEntries, {})
        console.log(`Inserted ${amoeEntries.length} demo AMOE entries`)
      }
    }

    // ========================================
    // 9. PROMO CODES
    // ========================================
    const existingPromocodes = await queryInterface.sequelize.query(
      `SELECT promocode_id FROM promo_codes WHERE promocode LIKE 'DEMO%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingPromocodes.length === 0) {
      const promocodes = [
        {
          promocode: 'DEMO50OFF',
          status: 1,
          valid_till: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
          max_users_availed: 1000,
          per_user_limit: 1,
          is_discount_on_amount: true,
          discount_percentage: 50,
          description: '50% off your next purchase!',
          valid_from: now,
          created_at: now,
          updated_at: now
        },
        {
          promocode: 'DEMOBONUS100',
          status: 1,
          valid_till: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          max_users_availed: 500,
          per_user_limit: 1,
          is_discount_on_amount: false,
          discount_percentage: 0,
          more_details: JSON.stringify({ bonusGc: 100000, bonusSc: 100 }),
          description: 'Get 100,000 GC + 100 SC bonus!',
          valid_from: now,
          created_at: now,
          updated_at: now
        },
        {
          promocode: 'DEMOVIP25',
          status: 1,
          valid_till: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          max_users_availed: 100,
          per_user_limit: 3,
          is_discount_on_amount: true,
          discount_percentage: 25,
          description: 'VIP exclusive 25% discount',
          valid_from: now,
          created_at: now,
          updated_at: now
        },
        {
          promocode: 'DEMOEXPIRED',
          status: 0,
          valid_till: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          max_users_availed: 500,
          per_user_limit: 1,
          is_discount_on_amount: true,
          discount_percentage: 20,
          description: 'This promo code has expired',
          valid_from: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
          created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('promo_codes', promocodes, {})
      console.log(`Inserted ${promocodes.length} demo promo codes`)
    }

    // ========================================
    // 10. CRM PROMOTIONS
    // ========================================
    const existingCrmPromos = await queryInterface.sequelize.query(
      `SELECT crm_promotion_id FROM crm_promotions WHERE name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingCrmPromos.length === 0) {
      // Use raw SQL to properly handle ARRAY(BIGINT) type
      const crmPromotionsData = [
        {
          promocode: 'DEMOCRM001',
          name: 'Demo: Re-engagement Campaign',
          campaign_id: 'CAMP-DEMO-001',
          status: 1,
          user_ids: demoUserId ? `ARRAY[${demoUserId}]::BIGINT[]` : 'ARRAY[]::BIGINT[]',
          claim_bonus: true,
          promotion_type: 'bonus',
          sc_amount: 25,
          gc_amount: 25000,
          crm_promocode: true,
          expire_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          valid_from: now,
          more_details: JSON.stringify({ targetAudience: 'inactive_30_days', channel: 'email' })
        },
        {
          promocode: 'DEMOCRM002',
          name: 'Demo: VIP Appreciation',
          campaign_id: 'CAMP-DEMO-002',
          status: 1,
          user_ids: demoUserId ? `ARRAY[${demoUserId}]::BIGINT[]` : 'ARRAY[]::BIGINT[]',
          claim_bonus: true,
          promotion_type: 'bonus',
          sc_amount: 100,
          gc_amount: 100000,
          crm_promocode: true,
          expire_at: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          valid_from: now,
          more_details: JSON.stringify({ targetAudience: 'vip_players', channel: 'push' })
        },
        {
          promocode: 'DEMOCRM003',
          name: 'Demo: Birthday Special',
          campaign_id: 'CAMP-DEMO-003',
          status: 1,
          user_ids: 'ARRAY[]::BIGINT[]',
          claim_bonus: true,
          promotion_type: 'promocode',
          sc_amount: 50,
          gc_amount: 50000,
          crm_promocode: false,
          expire_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          valid_from: now,
          more_details: JSON.stringify({ targetAudience: 'birthday_this_month', channel: 'email' })
        }
      ]

      for (const promo of crmPromotionsData) {
        await queryInterface.sequelize.query(
          `INSERT INTO crm_promotions (promocode, name, campaign_id, status, user_ids, claim_bonus, promotion_type, sc_amount, gc_amount, crm_promocode, expire_at, valid_from, more_details, created_at, updated_at)
           VALUES (:promocode, :name, :campaign_id, :status, ${promo.user_ids}, :claim_bonus, :promotion_type, :sc_amount, :gc_amount, :crm_promocode, :expire_at, :valid_from, :more_details, :now, :now)`,
          {
            replacements: {
              promocode: promo.promocode,
              name: promo.name,
              campaign_id: promo.campaign_id,
              status: promo.status,
              claim_bonus: promo.claim_bonus,
              promotion_type: promo.promotion_type,
              sc_amount: promo.sc_amount,
              gc_amount: promo.gc_amount,
              crm_promocode: promo.crm_promocode,
              expire_at: promo.expire_at,
              valid_from: promo.valid_from,
              more_details: promo.more_details,
              now
            }
          }
        )
      }
      console.log(`Inserted ${crmPromotionsData.length} demo CRM promotions`)
    }

    // ========================================
    // 11. EXPORT CENTER
    // ========================================
    if (demoAdminId) {
      const existingExports = await queryInterface.sequelize.query(
        `SELECT id FROM export_center WHERE type LIKE 'demo-%' LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingExports.length === 0) {
        const exports = [
          {
            admin_user_id: demoAdminId,
            payload: JSON.stringify({ dateFrom: '2026-01-01', dateTo: '2026-01-12', filters: {} }),
            type: 'demo-players-export',
            status: 'completed',
            is_active: true,
            url: 'https://example.com/exports/players-2026-01-12.csv',
            created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            admin_user_id: demoAdminId,
            payload: JSON.stringify({ dateFrom: '2026-01-01', dateTo: '2026-01-12', filters: { status: 'completed' } }),
            type: 'demo-transactions-export',
            status: 'completed',
            is_active: true,
            url: 'https://example.com/exports/transactions-2026-01-12.csv',
            created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            admin_user_id: demoAdminId,
            payload: JSON.stringify({ dateFrom: '2026-01-10', dateTo: '2026-01-12' }),
            type: 'demo-casino-report',
            status: 'pending',
            is_active: true,
            created_at: now,
            updated_at: now
          }
        ]

        await queryInterface.bulkInsert('export_center', exports, {})
        console.log(`Inserted ${exports.length} demo export center entries`)
      }
    }

    // ========================================
    // 12. NOTIFICATION CENTER
    // ========================================
    const existingNotifications = await queryInterface.sequelize.query(
      `SELECT id FROM admin_notifications WHERE title LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingNotifications.length === 0) {
      const notifications = [
        {
          title: 'Demo: New Tournament Launched',
          message: 'The Weekly Slots Championship tournament is now live! Players can join and compete for prizes.',
          type: 'tournament',
          subtype: 'launch',
          data: JSON.stringify({ tournamentId: 1, prizePool: 175000 }),
          link: '/admin/tournament',
          sender_type: 'system',
          priority: 'normal',
          status: JSON.stringify([]),
          created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Demo: High Stake Alert',
          message: 'A player has placed a bet exceeding the high-stake threshold. Review required.',
          type: 'high-stake-play',
          subtype: 'threshold-alert',
          data: JSON.stringify({ userId: demoUserId, betAmount: 500, game: 'Demo Slot' }),
          link: demoUserId ? `/admin/player-details/${demoUserId}` : '/admin/players',
          sender_type: 'system',
          priority: 'high',
          status: JSON.stringify([]),
          created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Demo: New Package Activated',
          message: 'The Diamond Treasure package has been activated and is now visible in the store.',
          type: 'package',
          subtype: 'activation',
          data: JSON.stringify({ packageId: 6, packageName: 'Diamond Treasure' }),
          link: '/admin/packages',
          sender_type: 'admin',
          sender_id: demoAdminId ? String(demoAdminId) : null,
          priority: 'normal',
          status: JSON.stringify([]),
          created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
        },
        {
          title: 'Demo: Giveaway Winner Selected',
          message: 'The Monthly Grand Giveaway winner has been automatically selected.',
          type: 'giveaway',
          subtype: 'winner-selected',
          data: JSON.stringify({ raffleId: 3, winnerId: demoUserId }),
          link: '/admin/raffle',
          sender_type: 'system',
          priority: 'normal',
          status: JSON.stringify(demoAdminId ? [demoAdminId] : []), // Mark as read by admin
          created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Demo: Large Redemption Request',
          message: 'A redemption request for $500+ requires manual review.',
          type: 'redemption',
          subtype: 'large-amount',
          data: JSON.stringify({ userId: demoUserId, amount: 750 }),
          link: '/admin/transactions-withdraw',
          sender_type: 'system',
          priority: 'high',
          status: JSON.stringify([]),
          created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
        }
      ]

      await queryInterface.bulkInsert('admin_notifications', notifications, {})
      console.log(`Inserted ${notifications.length} demo notifications`)
    }

    // ========================================
    // 13. DOMAIN BLOCKING
    // ========================================
    const existingDomains = await queryInterface.sequelize.query(
      `SELECT domain_id FROM blocked_domains LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingDomains.length === 0) {
      // Note: domain_name is INTEGER in the model (seems like a bug, but we'll work with it)
      const blockedDomains = [
        { domain_name: 1, created_at: now, updated_at: now },
        { domain_name: 2, created_at: now, updated_at: now },
        { domain_name: 3, created_at: now, updated_at: now }
      ]

      await queryInterface.bulkInsert('blocked_domains', blockedDomains, {})
      console.log(`Inserted ${blockedDomains.length} demo blocked domains`)
    }

    // ========================================
    // 14. PROMOCODE BLOCKING (Blocked Users)
    // ========================================
    if (demoUserId) {
      const existingBlockedUsers = await queryInterface.sequelize.query(
        `SELECT user_id FROM blocked_users LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingBlockedUsers.length === 0) {
        // We need to be careful here - blocked_users uses userId as primary key
        // Only insert if we have multiple demo users
        const additionalUsers = await queryInterface.sequelize.query(
          `SELECT user_id AS "userId" FROM users WHERE user_id != :demoUserId ORDER BY user_id ASC LIMIT 2;`,
          { type: QueryTypes.SELECT, replacements: { demoUserId } }
        )

        if (additionalUsers.length > 0) {
          const blockedUsers = additionalUsers.map(u => ({
            user_id: u.userId,
            is_avail_promocode_blocked: true,
            created_at: now
          }))

          await queryInterface.bulkInsert('blocked_users', blockedUsers, {})
          console.log(`Inserted ${blockedUsers.length} demo blocked users`)
        }
      }
    }

    // ========================================
    // 15. PROMOTION MANAGEMENT (Thumbnails)
    // ========================================
    const existingPromotionThumbnails = await queryInterface.sequelize.query(
      `SELECT promotion_thumbnail_id FROM promotion_thumbnails WHERE name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingPromotionThumbnails.length === 0) {
      const promotionThumbnails = [
        {
          name: 'Demo: Welcome Bonus Promo',
          desktop_image_url: 'https://example.com/promo-welcome-desktop.jpg',
          mobile_image_url: 'https://example.com/promo-welcome-mobile.jpg',
          navigate_route: '/promotions/welcome',
          order: 1,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Daily Rewards',
          desktop_image_url: 'https://example.com/promo-daily-desktop.jpg',
          mobile_image_url: 'https://example.com/promo-daily-mobile.jpg',
          navigate_route: '/promotions/daily',
          order: 2,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: VIP Program',
          desktop_image_url: 'https://example.com/promo-vip-desktop.jpg',
          mobile_image_url: 'https://example.com/promo-vip-mobile.jpg',
          navigate_route: '/vip',
          order: 3,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Tournament Banner',
          desktop_image_url: 'https://example.com/promo-tournament-desktop.jpg',
          mobile_image_url: 'https://example.com/promo-tournament-mobile.jpg',
          navigate_route: '/tournaments',
          order: 4,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Inactive Promo',
          desktop_image_url: 'https://example.com/promo-inactive-desktop.jpg',
          mobile_image_url: 'https://example.com/promo-inactive-mobile.jpg',
          navigate_route: '/promotions/old',
          order: 99,
          is_active: false,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('promotion_thumbnails', promotionThumbnails, {})
      console.log(`Inserted ${promotionThumbnails.length} demo promotion thumbnails`)
    }

    // ========================================
    // 16. MAINTENANCE MODE
    // ========================================
    const existingMaintenance = await queryInterface.sequelize.query(
      `SELECT maintenance_mode_id FROM maintenance_mode WHERE message LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingMaintenance.length === 0) {
      const maintenanceModes = [
        {
          is_active: false,
          start_time: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Scheduled for next week
          end_time: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours
          message: 'Demo: Scheduled maintenance for system upgrades. We apologize for any inconvenience.',
          created_at: now,
          updated_at: now
        },
        {
          is_active: false,
          start_time: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          end_time: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          message: 'Demo: Past maintenance - Database optimization completed successfully.',
          created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        }
      ]

      await queryInterface.bulkInsert('maintenance_mode', maintenanceModes, {})
      console.log(`Inserted ${maintenanceModes.length} demo maintenance modes`)
    }

    console.log('All remaining sections demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove all demo data in reverse order
    await queryInterface.sequelize.query(`DELETE FROM maintenance_mode WHERE message LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM promotion_thumbnails WHERE name LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM blocked_users;`) // Be careful with this
    await queryInterface.sequelize.query(`DELETE FROM blocked_domains;`)
    await queryInterface.sequelize.query(`DELETE FROM admin_notifications WHERE title LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM export_center WHERE type LIKE 'demo-%';`)
    await queryInterface.sequelize.query(`DELETE FROM crm_promotions WHERE name LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM promo_codes WHERE promocode LIKE 'DEMO%';`)
    await queryInterface.sequelize.query(`DELETE FROM amoe WHERE entry_id LIKE 'DEMO-%';`)
    await queryInterface.sequelize.query(`DELETE FROM affiliates WHERE email LIKE 'demo-affiliate%';`)
    await queryInterface.sequelize.query(`DELETE FROM bonus WHERE bonus_name LIKE 'Demo:%';`)
    // Best-effort cleanup: older schemas might not have email_templates.label
    try {
      await queryInterface.sequelize.query(`DELETE FROM email_templates WHERE label LIKE 'Demo:%';`)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[DEMO SEED] Cleanup skipped for email_templates: ${e?.message || e}`)
    }
    await queryInterface.sequelize.query(`DELETE FROM cms_pages WHERE slug LIKE 'demo-%';`)
    await queryInterface.sequelize.query(`DELETE FROM raffles WHERE title LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM tiers WHERE name LIKE 'Demo:%';`)
    await queryInterface.sequelize.query(`DELETE FROM tournament WHERE title LIKE 'Demo:%';`)

    console.log('All remaining sections demo data removed')
  }
}
