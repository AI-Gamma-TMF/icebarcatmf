'use strict'

const { Op } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'SC_TO_GC_RATE',
        value: '1000',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'XP_SC_TO_GC_RATE',
        value: '10',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'global_settings',
      {
        key: ['SC_TO_GC_RATE', 'XP_SC_TO_GC_RATE'] // Specify the keys you want to delete
      },
      {}
    )
  }
}
