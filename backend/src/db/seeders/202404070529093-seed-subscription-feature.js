'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('subscription_features', [
      {
        name: 'Daily Bonus Multiplier',
        key: 'DAILY_BONUS_MULTIPLIER',
        value_type: 'float',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tournament Joining Fee Discount',
        key: 'TOURNAMENT_JOINING_FEE_DISCOUNT',
        value_type: 'integer',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      // {
      //   name: 'Weekly Free Spin',
      //   key: 'WEEKLY_FREE_SPIN',
      //   value_type: 'integer',
      //   is_active: false,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // },
      {
        name: 'Vault Interest Rate',
        key: 'VAULT_INTEREST_RATE',
        value_type: 'float',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Subscriber Only Tournament',
        key: 'TOURNAMENT_SUBSCRIBER_ONLY',
        value_type: 'boolean',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Subscriber Only Package',
        key: 'PACKAGE_SUBSCRIBER_ONLY',
        value_type: 'boolean',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Exclusive Package Discount',
        key: 'PACKAGE_EXCLUSIVE_DISCOUNT',
        value_type: 'integer',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Guaranteed Redemption Approved Time for Subscribers',
        key: 'GUARANTEED_REDEMPTION_APPROVED_TIME',
        value_type: 'integer',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subscription_features', {

    })
  }
}
