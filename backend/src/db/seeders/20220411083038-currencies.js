'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('currencies', [
      {
        name: 'Euro',
        code: 'EUR',
        type: '1',
        exchange_rate: '1',
        symbol: '€',
        loyalty_point: 0.5,
        is_primary: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Rupee',
        code: 'INR',
        type: '1',
        exchange_rate: '0.012',
        symbol: '₹',
        loyalty_point: 0.5,
        is_primary: false,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'United Sates Dollar',
        code: 'USD',
        type: '1',
        exchange_rate: '0.93',
        symbol: '$',
        loyalty_point: 0.5,
        is_primary: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Japan Yen',
        code: 'JPY',
        type: '1',
        exchange_rate: '0.0073',
        symbol: '¥',
        loyalty_point: 0.5,
        is_primary: false,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('currencies', null, {})
  }
}
