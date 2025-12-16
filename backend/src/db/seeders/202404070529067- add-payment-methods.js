'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('payment_methods', [
      {
        method_name: 'APPLE_PAY',
        payment_provider: 'paysafe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        method_name: 'CARD',
        payment_provider: 'paysafe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        method_name: 'SKRILL',
        payment_provider: 'paysafe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        method_name: 'PAY_BY_BANK',
        payment_provider: 'paysafe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        method_name: 'TRUSTLY',
        payment_provider: 'trustly',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('payment_methods', null, {})
  }
}
