'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'KYC_DEPOSIT_AMOUNT',
        value: '2500',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'KYC_REDEEM_AMOUNT',
        value: '5000',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'CARD_PURCHASE_AMOUNT',
        value: '10000',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'global_settings',
      {
        key: ['KYC_DEPOSIT_AMOUNT', 'KYC_REDEEM_AMOUNT']
      },
      {}
    )
  }
}
