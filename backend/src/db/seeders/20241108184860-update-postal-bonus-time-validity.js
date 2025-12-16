'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings',
      [
        {
          key: 'POSTAL_CODE_TIME',
          value: '5',
          created_at: new Date(),
          updated_at: new Date()
        }, {
          key: 'POSTAL_CODE_VALID_TILL',
          value: '15',
          created_at: new Date(),
          updated_at: new Date()
        }

      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('global_settings', {
      key: ['POSTAL_CODE_TIME', 'POSTAL_CODE_VALID_TILL']
    }, {})
  }
}
