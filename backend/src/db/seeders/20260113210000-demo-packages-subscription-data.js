'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for Packages and Subscription sections:
// - Packages (GET /api/v1/package) -> package table
// - Subscription Report (GET /api/v1/subscription/report) -> user_subscriptions + subscriptions
// - User Subscription (GET /api/v1/subscription/user-subscriptions) -> user_subscriptions
// - Subscription Plan (GET /api/v1/subscription/plans) -> subscriptions
// - Subscription Feature (GET /api/v1/subscription/features) -> subscription_features + subscription_feature_map
//
// This seeder is idempotent: it checks for existing demo data before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // Fetch demo user for user subscriptions
    const userRow = await queryInterface.sequelize.query(
      `SELECT user_id AS "userId" FROM users ORDER BY user_id ASC LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    const demoUserId = userRow?.[0]?.userId

    // ========================================
    // 1. Packages
    // ========================================
    const existingPackages = await queryInterface.sequelize.query(
      `SELECT package_id AS "id" FROM package WHERE package_name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingPackages.length === 0) {
      const packages = [
        {
          package_name: 'Demo: Starter Pack',
          amount: 4.99,
          gc_coin: 10000,
          sc_coin: 2,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-starter.png',
          order_id: 1,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 2,
          first_purchase_gc_bonus: 5000,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: true,
          welcome_purchase_bonus_applicable_minutes: 60,
          welcome_purchase_percentage: '100',
          bonus_sc: 0,
          bonus_gc: 0,
          is_special_package: false,
          is_subscriber_only: false,
          package_tag: 'BEST VALUE',
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Bronze Bundle',
          amount: 9.99,
          gc_coin: 25000,
          sc_coin: 5,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-bronze.png',
          order_id: 2,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 5,
          first_purchase_gc_bonus: 12500,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 1,
          bonus_gc: 2500,
          is_special_package: false,
          is_subscriber_only: false,
          package_tag: null,
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Silver Stack',
          amount: 19.99,
          gc_coin: 60000,
          sc_coin: 12,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-silver.png',
          order_id: 3,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 12,
          first_purchase_gc_bonus: 30000,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 2,
          bonus_gc: 5000,
          is_special_package: false,
          is_subscriber_only: false,
          package_tag: 'POPULAR',
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Gold Chest',
          amount: 49.99,
          gc_coin: 175000,
          sc_coin: 35,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-gold.png',
          order_id: 4,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 35,
          first_purchase_gc_bonus: 87500,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 5,
          bonus_gc: 15000,
          is_special_package: false,
          is_subscriber_only: false,
          package_tag: null,
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Platinum Vault',
          amount: 99.99,
          gc_coin: 400000,
          sc_coin: 80,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-platinum.png',
          order_id: 5,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 80,
          first_purchase_gc_bonus: 200000,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 15,
          bonus_gc: 40000,
          is_special_package: false,
          is_subscriber_only: false,
          package_tag: 'BEST VALUE',
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Diamond Treasure',
          amount: 199.99,
          gc_coin: 1000000,
          sc_coin: 200,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-diamond.png',
          order_id: 6,
          first_purchase_bonus_applicable: true,
          first_purchase_sc_bonus: 200,
          first_purchase_gc_bonus: 500000,
          purchase_limit_per_user: 0,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 50,
          bonus_gc: 100000,
          is_special_package: true,
          is_subscriber_only: false,
          package_tag: 'VIP EXCLUSIVE',
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Subscriber Special',
          amount: 14.99,
          gc_coin: 50000,
          sc_coin: 15,
          is_active: true,
          is_visible_in_store: true,
          image_url: 'https://example.com/package-subscriber.png',
          order_id: 7,
          first_purchase_bonus_applicable: false,
          first_purchase_sc_bonus: 0,
          first_purchase_gc_bonus: 0,
          purchase_limit_per_user: 1,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 5,
          bonus_gc: 10000,
          is_special_package: true,
          is_subscriber_only: true,
          package_tag: 'SUBSCRIBERS ONLY',
          purchase_no: 0,
          created_at: now,
          updated_at: now
        },
        {
          package_name: 'Demo: Limited Time Offer',
          amount: 29.99,
          gc_coin: 100000,
          sc_coin: 25,
          is_active: false, // Inactive for demo
          is_visible_in_store: false,
          image_url: 'https://example.com/package-limited.png',
          order_id: 8,
          first_purchase_bonus_applicable: false,
          first_purchase_sc_bonus: 0,
          first_purchase_gc_bonus: 0,
          purchase_limit_per_user: 3,
          welcome_purchase_bonus_applicable: false,
          welcome_purchase_bonus_applicable_minutes: 0,
          welcome_purchase_percentage: null,
          bonus_sc: 10,
          bonus_gc: 25000,
          is_special_package: true,
          is_subscriber_only: false,
          package_tag: 'LIMITED',
          valid_from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          valid_till: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          purchase_no: 0,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('package', packages, {})
      console.log(`Inserted ${packages.length} demo packages`)
    }

    // ========================================
    // 2. Subscription Features
    // ========================================
    const existingFeatures = await queryInterface.sequelize.query(
      `SELECT subscription_feature_id AS "id" FROM subscription_features WHERE key LIKE 'demo_%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    let featureIds = {}
    if (existingFeatures.length === 0) {
      const features = [
        {
          name: 'Daily SC Bonus',
          key: 'demo_daily_sc_bonus',
          description: 'Amount of SC coins awarded daily to subscribers',
          value_type: 'integer',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Daily GC Bonus',
          key: 'demo_daily_gc_bonus',
          description: 'Amount of GC coins awarded daily to subscribers',
          value_type: 'integer',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Exclusive Games Access',
          key: 'demo_exclusive_games',
          description: 'Access to subscriber-only games',
          value_type: 'boolean',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Priority Support',
          key: 'demo_priority_support',
          description: 'Priority customer support queue',
          value_type: 'boolean',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Cashback Percentage',
          key: 'demo_cashback_percent',
          description: 'Weekly cashback percentage on losses',
          value_type: 'float',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Free Spins Per Week',
          key: 'demo_free_spins_weekly',
          description: 'Number of free spins awarded weekly',
          value_type: 'integer',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Exclusive Packages',
          key: 'demo_exclusive_packages',
          description: 'Access to subscriber-only purchase packages',
          value_type: 'boolean',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          name: 'Faster Redemptions',
          key: 'demo_faster_redemptions',
          description: 'Expedited redemption processing',
          value_type: 'boolean',
          is_active: true,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('subscription_features', features, {})
      console.log(`Inserted ${features.length} demo subscription features`)

      // Fetch inserted feature IDs
      const insertedFeatures = await queryInterface.sequelize.query(
        `SELECT subscription_feature_id AS "id", key FROM subscription_features WHERE key LIKE 'demo_%';`,
        { type: QueryTypes.SELECT }
      )
      insertedFeatures.forEach(f => { featureIds[f.key] = f.id })
    } else {
      // Fetch existing feature IDs
      const existingFeaturesList = await queryInterface.sequelize.query(
        `SELECT subscription_feature_id AS "id", key FROM subscription_features WHERE key LIKE 'demo_%';`,
        { type: QueryTypes.SELECT }
      )
      existingFeaturesList.forEach(f => { featureIds[f.key] = f.id })
    }

    // ========================================
    // 3. Subscription Plans
    // ========================================
    const existingPlans = await queryInterface.sequelize.query(
      `SELECT subscription_id AS "id" FROM subscriptions WHERE name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    let planIds = {}
    if (existingPlans.length === 0) {
      const plans = [
        {
          name: 'Demo: Basic Subscriber',
          description: 'Entry-level subscription with daily bonuses and basic perks',
          monthly_amount: 9.99,
          yearly_amount: 99.99,
          weekly_purchase_count: 1,
          thumbnail: 'https://example.com/sub-basic.png',
          sc_coin: 5,
          gc_coin: 10000,
          platform: 'all',
          is_active: true,
          special_plan: false,
          order_id: 1,
          more_details: JSON.stringify({ tier: 'basic', color: '#CD7F32' }),
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Premium Subscriber',
          description: 'Enhanced subscription with increased bonuses and exclusive access',
          monthly_amount: 19.99,
          yearly_amount: 199.99,
          weekly_purchase_count: 2,
          thumbnail: 'https://example.com/sub-premium.png',
          sc_coin: 15,
          gc_coin: 30000,
          platform: 'all',
          is_active: true,
          special_plan: false,
          order_id: 2,
          more_details: JSON.stringify({ tier: 'premium', color: '#C0C0C0' }),
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Elite Subscriber',
          description: 'Top-tier subscription with maximum benefits and VIP treatment',
          monthly_amount: 49.99,
          yearly_amount: 499.99,
          weekly_purchase_count: 5,
          thumbnail: 'https://example.com/sub-elite.png',
          sc_coin: 50,
          gc_coin: 100000,
          platform: 'all',
          is_active: true,
          special_plan: true,
          order_id: 3,
          more_details: JSON.stringify({ tier: 'elite', color: '#FFD700' }),
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Mobile Exclusive',
          description: 'Special subscription available only on mobile platforms',
          monthly_amount: 7.99,
          yearly_amount: 79.99,
          weekly_purchase_count: 1,
          thumbnail: 'https://example.com/sub-mobile.png',
          sc_coin: 8,
          gc_coin: 15000,
          platform: 'ios',
          is_active: true,
          special_plan: true,
          order_id: 4,
          more_details: JSON.stringify({ tier: 'mobile', color: '#4A90D9' }),
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Android Special',
          description: 'Android-only subscription with platform bonuses',
          monthly_amount: 7.99,
          yearly_amount: 79.99,
          weekly_purchase_count: 1,
          thumbnail: 'https://example.com/sub-android.png',
          sc_coin: 8,
          gc_coin: 15000,
          platform: 'android',
          is_active: true,
          special_plan: true,
          order_id: 5,
          more_details: JSON.stringify({ tier: 'android', color: '#3DDC84' }),
          created_at: now,
          updated_at: now
        },
        {
          name: 'Demo: Legacy Plan',
          description: 'Discontinued subscription plan (inactive)',
          monthly_amount: 14.99,
          yearly_amount: 149.99,
          weekly_purchase_count: 2,
          thumbnail: 'https://example.com/sub-legacy.png',
          sc_coin: 10,
          gc_coin: 20000,
          platform: 'web',
          is_active: false,
          special_plan: false,
          order_id: 99,
          more_details: JSON.stringify({ tier: 'legacy', color: '#808080' }),
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('subscriptions', plans, {})
      console.log(`Inserted ${plans.length} demo subscription plans`)

      // Fetch inserted plan IDs
      const insertedPlans = await queryInterface.sequelize.query(
        `SELECT subscription_id AS "id", name FROM subscriptions WHERE name LIKE 'Demo:%';`,
        { type: QueryTypes.SELECT }
      )
      insertedPlans.forEach(p => { planIds[p.name] = p.id })
    } else {
      // Fetch existing plan IDs
      const existingPlansList = await queryInterface.sequelize.query(
        `SELECT subscription_id AS "id", name FROM subscriptions WHERE name LIKE 'Demo:%';`,
        { type: QueryTypes.SELECT }
      )
      existingPlansList.forEach(p => { planIds[p.name] = p.id })
    }

    // ========================================
    // 4. Subscription Feature Mappings
    // ========================================
    if (Object.keys(featureIds).length > 0 && Object.keys(planIds).length > 0) {
      const existingMappings = await queryInterface.sequelize.query(
        `SELECT id FROM subscription_feature_map WHERE subscription_id IN (
          SELECT subscription_id FROM subscriptions WHERE name LIKE 'Demo:%'
        ) LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingMappings.length === 0) {
        const featureMappings = []

        // Basic plan features
        const basicPlanId = planIds['Demo: Basic Subscriber']
        if (basicPlanId) {
          featureMappings.push(
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_daily_sc_bonus, value: '1', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_daily_gc_bonus, value: '2000', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_exclusive_games, value: 'false', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_priority_support, value: 'false', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_cashback_percent, value: '2.5', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_free_spins_weekly, value: '10', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_exclusive_packages, value: 'true', created_at: now, updated_at: now },
            { subscription_id: basicPlanId, subscription_feature_id: featureIds.demo_faster_redemptions, value: 'false', created_at: now, updated_at: now }
          )
        }

        // Premium plan features
        const premiumPlanId = planIds['Demo: Premium Subscriber']
        if (premiumPlanId) {
          featureMappings.push(
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_daily_sc_bonus, value: '3', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_daily_gc_bonus, value: '6000', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_exclusive_games, value: 'true', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_priority_support, value: 'true', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_cashback_percent, value: '5.0', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_free_spins_weekly, value: '25', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_exclusive_packages, value: 'true', created_at: now, updated_at: now },
            { subscription_id: premiumPlanId, subscription_feature_id: featureIds.demo_faster_redemptions, value: 'true', created_at: now, updated_at: now }
          )
        }

        // Elite plan features
        const elitePlanId = planIds['Demo: Elite Subscriber']
        if (elitePlanId) {
          featureMappings.push(
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_daily_sc_bonus, value: '10', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_daily_gc_bonus, value: '20000', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_exclusive_games, value: 'true', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_priority_support, value: 'true', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_cashback_percent, value: '10.0', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_free_spins_weekly, value: '100', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_exclusive_packages, value: 'true', created_at: now, updated_at: now },
            { subscription_id: elitePlanId, subscription_feature_id: featureIds.demo_faster_redemptions, value: 'true', created_at: now, updated_at: now }
          )
        }

        // Filter out any mappings with null feature IDs
        const validMappings = featureMappings.filter(m => m.subscription_feature_id != null)

        if (validMappings.length > 0) {
          await queryInterface.bulkInsert('subscription_feature_map', validMappings, {})
          console.log(`Inserted ${validMappings.length} demo subscription feature mappings`)
        }
      }
    }

    // ========================================
    // 5. User Subscriptions (for Subscription Report & User Subscription pages)
    // ========================================
    if (demoUserId && Object.keys(planIds).length > 0) {
      const existingUserSubs = await queryInterface.sequelize.query(
        `SELECT user_subscription_id AS "id" FROM user_subscriptions WHERE transaction_id LIKE 'demo-sub-%' LIMIT 1;`,
        { type: QueryTypes.SELECT }
      )

      if (existingUserSubs.length === 0) {
        const userSubscriptions = []

        // Active subscription
        const premiumPlanId = planIds['Demo: Premium Subscriber']
        if (premiumPlanId) {
          userSubscriptions.push({
            user_id: demoUserId,
            subscription_id: premiumPlanId,
            status: 'active',
            plan_type: 'monthly',
            start_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Started 15 days ago
            end_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // Ends in 15 days
            auto_renew: true,
            transaction_id: `demo-sub-active-${Date.now()}`,
            more_details: JSON.stringify({ source: 'web', promoCode: null }),
            created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
            updated_at: now
          })
        }

        // Past subscription (completed)
        const basicPlanId = planIds['Demo: Basic Subscriber']
        if (basicPlanId) {
          userSubscriptions.push({
            user_id: demoUserId,
            subscription_id: basicPlanId,
            status: 'expired',
            plan_type: 'monthly',
            start_date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
            end_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Ended 30 days ago
            auto_renew: false,
            transaction_id: `demo-sub-expired-${Date.now()}`,
            more_details: JSON.stringify({ source: 'web', promoCode: 'WELCOME10' }),
            created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
            updated_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          })
        }

        // Cancelled subscription
        const elitePlanId = planIds['Demo: Elite Subscriber']
        if (elitePlanId) {
          userSubscriptions.push({
            user_id: demoUserId,
            subscription_id: elitePlanId,
            status: 'cancelled',
            plan_type: 'yearly',
            start_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // Started 90 days ago
            end_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Ended 10 days ago
            auto_renew: false,
            transaction_id: `demo-sub-cancelled-${Date.now()}`,
            cancellation_reason: 'User requested cancellation - switching to monthly plan',
            canceled_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            more_details: JSON.stringify({ source: 'ios', promoCode: null }),
            created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
            updated_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          })
        }

        // Pending subscription
        const mobilePlanId = planIds['Demo: Mobile Exclusive']
        if (mobilePlanId) {
          userSubscriptions.push({
            user_id: demoUserId + 1 || demoUserId,
            subscription_id: mobilePlanId,
            status: 'pending',
            plan_type: 'monthly',
            start_date: now,
            end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            auto_renew: true,
            transaction_id: `demo-sub-pending-${Date.now()}`,
            more_details: JSON.stringify({ source: 'ios', promoCode: 'MOBILE20' }),
            created_at: now,
            updated_at: now
          })
        }

        if (userSubscriptions.length > 0) {
          await queryInterface.bulkInsert('user_subscriptions', userSubscriptions, {})
          console.log(`Inserted ${userSubscriptions.length} demo user subscriptions`)
        }
      }
    }

    console.log('Packages and Subscription demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove user subscriptions
    await queryInterface.sequelize.query(
      `DELETE FROM user_subscriptions WHERE transaction_id LIKE 'demo-sub-%';`
    )

    // Remove feature mappings for demo plans
    await queryInterface.sequelize.query(
      `DELETE FROM subscription_feature_map WHERE subscription_id IN (
        SELECT subscription_id FROM subscriptions WHERE name LIKE 'Demo:%'
      );`
    )

    // Remove subscription plans
    await queryInterface.sequelize.query(
      `DELETE FROM subscriptions WHERE name LIKE 'Demo:%';`
    )

    // Remove subscription features
    await queryInterface.sequelize.query(
      `DELETE FROM subscription_features WHERE key LIKE 'demo_%';`
    )

    // Remove packages
    await queryInterface.sequelize.query(
      `DELETE FROM package WHERE package_name LIKE 'Demo:%';`
    )

    console.log('Packages and Subscription demo data removed')
  }
}
