'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('credentials_keys', [
      {
        name: 'APP_TWILIO_SERVICE_ID',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'APP_TWILIO_AUTH_TOKEN',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'APP_SENDGRID_API_KEY',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'APP_SENDGRID_EMAIL',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'SUPPORT_EMAIL_ADDRESS',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'OPERATOR_DEBIT_API',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'OPERATOR_CREDIT_API',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('credentials_keys', null, {})
  }
}
