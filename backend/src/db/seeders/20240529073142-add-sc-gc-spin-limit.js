'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'MINIMUM_SC_SPIN_LIMIT',
        value: '0.25',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MINIMUM_GC_SPIN_LIMIT',
        value: '1000',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'global_settings',
      {
        key: ['MINIMUM_SC_SPIN_LIMIT', 'MINIMUM_GC_SPIN_LIMIT'] // Specify the keys you want to delete
      },
      {}
    )
  }
}
