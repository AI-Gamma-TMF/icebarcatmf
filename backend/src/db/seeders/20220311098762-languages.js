'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('languages', [
      {
        code: 'RU',
        language_name: 'Russian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PS',
        language_name: 'Pasto',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AR',
        language_name: 'Arabic',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'EN',
        language_name: 'English',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PT',
        language_name: 'Portuguese',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DE',
        language_name: 'German',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DU',
        language_name: 'Dutch',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FR',
        language_name: 'French',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ES',
        language_name: 'Spanish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SR',
        language_name: 'Serbian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BS',
        language_name: 'Bosnian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BG',
        language_name: 'Bulgarian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CN',
        language_name: 'Mandarin Chinese',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JA',
        language_name: 'Japanese',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MS',
        language_name: 'Malay',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GR',
        language_name: 'Greek',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TR',
        language_name: 'Turkish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CZ',
        language_name: 'Czech',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SK',
        language_name: 'Slovak',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DA',
        language_name: 'Danish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HI',
        language_name: 'Hindi',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FI',
        language_name: 'Finnish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SW',
        language_name: 'Swedish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HU',
        language_name: 'Hungarian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ID',
        language_name: 'Indonesian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FA',
        language_name: 'Persian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IT',
        language_name: 'Italian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KO',
        language_name: 'Korean',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MT',
        language_name: 'Maltese',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MU',
        language_name: 'Mauritian Creole',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RO',
        language_name: 'Romanian',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TH',
        language_name: 'Thai',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VI',
        language_name: 'Vietnamese',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PL',
        language_name: 'Polish',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      }

    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('languages', null, {})
  }
}
