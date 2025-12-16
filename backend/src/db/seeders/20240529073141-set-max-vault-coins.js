'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'MAX_SC_VAULT_PER',
        value: '100',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MAX_GC_VAULT_PER',
        value: '100',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'global_settings',
      {
        key: ['MAX_SC_VAULT_PER', 'MAX_GC_VAULT_PER']
      },
      {}
    )
  }
}
