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
      const redeemRules = [
        {
          rule_name: 'Demo: Standard Redemption',
          rule_condition: JSON.stringify({
            minAmount: 50,
            maxAmount: 5000,
            minPlaythrough: 1,
            kycRequired: true,
            tierRequired: null,
            description: 'Standard redemption rule for all verified users'
          }),
          is_active: true,
          completion_time: '24-48 hours',
          is_subscriber_only: false,
          player_ids: [],
          created_at: now,
          updated_at: now
        },
        {
          rule_name: 'Demo: VIP Fast Track',
          rule_condition: JSON.stringify({
            minAmount: 100,
            maxAmount: 25000,
            minPlaythrough: 0.5,
            kycRequired: true,
            tierRequired: 'Gold',
            description: 'Expedited processing for VIP members'
          }),
          is_active: true,
          completion_time: '2-6 hours',
          is_subscriber_only: false,
          player_ids: [],
          created_at: now,
          updated_at: now
        },
        {
          rule_name: 'Demo: Subscriber Exclusive',
          rule_condition: JSON.stringify({
            minAmount: 25,
            maxAmount: 10000,
            minPlaythrough: 0.75,
            kycRequired: true,
            tierRequired: null,
            description: 'Special rates for active subscribers'
          }),
          is_active: true,
          completion_time: '12-24 hours',
          is_subscriber_only: true,
          player_ids: [],
          created_at: now,
          updated_at: now
        },
        {
          rule_name: 'Demo: High Roller',
          rule_condition: JSON.stringify({
            minAmount: 1000,
            maxAmount: 100000,
            minPlaythrough: 1,
            kycRequired: true,
            tierRequired: 'Diamond',
            description: 'Premium redemption for high-value players'
          }),
          is_active: true,
          completion_time: '1-4 hours',
          is_subscriber_only: false,
          player_ids: [],
          created_at: now,
          updated_at: now
        },
        {
          rule_name: 'Demo: Weekend Special',
          rule_condition: JSON.stringify({
            minAmount: 20,
            maxAmount: 2000,
            minPlaythrough: 1.5,
            kycRequired: true,
            tierRequired: null,
            daysOfWeek: ['Saturday', 'Sunday'],
            description: 'Weekend-only redemption with bonus processing'
          }),
          is_active: false, // Inactive rule for demo
          completion_time: '24-72 hours',
          is_subscriber_only: false,
          player_ids: [],
          created_at: now,
          updated_at: now
        },
        {
          rule_name: 'Demo: New Player Welcome',
          rule_condition: JSON.stringify({
            minAmount: 10,
            maxAmount: 500,
            minPlaythrough: 2,
            kycRequired: true,
            tierRequired: null,
            maxAccountAge: 30,
            description: 'First redemption for new players within 30 days'
          }),
          is_active: true,
          completion_time: '48-72 hours',
          is_subscriber_only: false,
          player_ids: [],
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('redeem_rule', redeemRules, {})
      console.log(`Inserted ${redeemRules.length} demo redeem rules`)
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
