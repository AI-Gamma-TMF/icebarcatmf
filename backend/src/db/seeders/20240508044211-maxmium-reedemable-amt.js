'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'MAXIMUM_REDEEMABLE_COINS',
        value: '10000',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('global_settings', {
      key: 'MAXIMUM_REDEEMABLE_COINS'
    }, {})
  }
}
