'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'VIP_QUESTIONNAIRE_MIN_BONUS',
        value: '5',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'VIP_QUESTIONNAIRE_MAX_BONUS',
        value: '150',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'VIP_QUESTIONNAIRE_NGR_MULTIPLIER',
        value: '0.0075',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('global_settings', {
      key: {
        [Sequelize.Op.in]: [
          'VIP_QUESTIONNAIRE_MIN_BONUS',
          'VIP_QUESTIONNAIRE_MAX_BONUS',
          'VIP_QUESTIONNAIRE_NGR_MULTIPLIER'
        ]
      }
    })
  }
}
