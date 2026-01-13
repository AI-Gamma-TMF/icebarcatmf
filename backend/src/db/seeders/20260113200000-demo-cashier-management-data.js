'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for Cashier Management sections:
// - Redeem Rules (GET /api/v1/cashier-management/redeem-rule) -> redeem_rule table
// - Payment Provider (GET /api/v1/cashier-management/payment-provider) -> payment_methods table
//
// This seeder is idempotent: it checks for existing demo data before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // ========================================
    // 1. Redeem Rules
    // ========================================
    const existingRules = await queryInterface.sequelize.query(
      `SELECT rule_id AS "id" FROM redeem_rule WHERE rule_name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingRules.length === 0) {
      // Use raw SQL to handle empty integer arrays properly in PostgreSQL
      const redeemRulesData = [
        {
          name: 'Demo: Standard Redemption',
          condition: JSON.stringify({
            minAmount: 50,
            maxAmount: 5000,
            minPlaythrough: 1,
            kycRequired: true,
            tierRequired: null,
            description: 'Standard redemption rule for all verified users'
          }),
          isActive: true,
          completionTime: '24-48 hours',
          isSubscriberOnly: false
        },
        {
          name: 'Demo: VIP Fast Track',
          condition: JSON.stringify({
            minAmount: 100,
            maxAmount: 25000,
            minPlaythrough: 0.5,
            kycRequired: true,
            tierRequired: 'Gold',
            description: 'Expedited processing for VIP members'
          }),
          isActive: true,
          completionTime: '2-6 hours',
          isSubscriberOnly: false
        },
        {
          name: 'Demo: Subscriber Exclusive',
          condition: JSON.stringify({
            minAmount: 25,
            maxAmount: 10000,
            minPlaythrough: 0.75,
            kycRequired: true,
            tierRequired: null,
            description: 'Special rates for active subscribers'
          }),
          isActive: true,
          completionTime: '12-24 hours',
          isSubscriberOnly: true
        },
        {
          name: 'Demo: High Roller',
          condition: JSON.stringify({
            minAmount: 1000,
            maxAmount: 100000,
            minPlaythrough: 1,
            kycRequired: true,
            tierRequired: 'Diamond',
            description: 'Premium redemption for high-value players'
          }),
          isActive: true,
          completionTime: '1-4 hours',
          isSubscriberOnly: false
        },
        {
          name: 'Demo: Weekend Special',
          condition: JSON.stringify({
            minAmount: 20,
            maxAmount: 2000,
            minPlaythrough: 1.5,
            kycRequired: true,
            tierRequired: null,
            daysOfWeek: ['Saturday', 'Sunday'],
            description: 'Weekend-only redemption with bonus processing'
          }),
          isActive: false,
          completionTime: '24-72 hours',
          isSubscriberOnly: false
        },
        {
          name: 'Demo: New Player Welcome',
          condition: JSON.stringify({
            minAmount: 10,
            maxAmount: 500,
            minPlaythrough: 2,
            kycRequired: true,
            tierRequired: null,
            maxAccountAge: 30,
            description: 'First redemption for new players within 30 days'
          }),
          isActive: true,
          completionTime: '48-72 hours',
          isSubscriberOnly: false
        }
      ]

      // Insert using raw SQL - use NULL for player_ids to avoid empty array type issues
      for (const rule of redeemRulesData) {
        await queryInterface.sequelize.query(
          `INSERT INTO redeem_rule (rule_name, rule_condition, is_active, completion_time, is_subscriber_only, player_ids, created_at, updated_at)
           VALUES (:name, :condition, :isActive, :completionTime, :isSubscriberOnly, NULL, :now, :now)`,
          {
            replacements: {
              name: rule.name,
              condition: rule.condition,
              isActive: rule.isActive,
              completionTime: rule.completionTime,
              isSubscriberOnly: rule.isSubscriberOnly,
              now
            }
          }
        )
      }
      console.log(`Inserted ${redeemRulesData.length} demo redeem rules`)
    }

    // ========================================
    // 2. Payment Providers/Methods
    // ========================================
    const existingPaymentMethods = await queryInterface.sequelize.query(
      `SELECT payment_method_id AS "id" FROM payment_methods WHERE method_name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingPaymentMethods.length === 0) {
      const paymentMethods = [
        {
          method_name: 'Demo: Visa/Mastercard',
          payment_provider: 'Stripe',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: American Express',
          payment_provider: 'Stripe',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Bank Transfer (ACH)',
          payment_provider: 'Plaid',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: PayPal',
          payment_provider: 'PayPal',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Apple Pay',
          payment_provider: 'Stripe',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Google Pay',
          payment_provider: 'Stripe',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Skrill',
          payment_provider: 'Skrill',
          is_active: false, // Inactive for demo
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Neteller',
          payment_provider: 'Neteller',
          is_active: false, // Inactive for demo
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Bitcoin',
          payment_provider: 'Coinbase',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Ethereum',
          payment_provider: 'Coinbase',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Wire Transfer',
          payment_provider: 'Manual',
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          method_name: 'Demo: Interac (Canada)',
          payment_provider: 'Interac',
          is_active: true,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('payment_methods', paymentMethods, {})
      console.log(`Inserted ${paymentMethods.length} demo payment methods`)
    }

    console.log('Cashier Management demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove demo redeem rules
    await queryInterface.sequelize.query(
      `DELETE FROM redeem_rule WHERE rule_name LIKE 'Demo:%';`
    )

    // Remove demo payment methods
    await queryInterface.sequelize.query(
      `DELETE FROM payment_methods WHERE method_name LIKE 'Demo:%';`
    )

    console.log('Cashier Management demo data removed')
  }
}
