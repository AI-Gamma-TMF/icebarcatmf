'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('payment_methods', [
      {
        method_name: 'PaymentIQ',
        payment_providers: JSON.stringify([
          'Bank',
          'Creditcard',
          'Flexepin',
          'Icard',
          'Interac',
          'JPay',
          'Jeton',
          'Paypal',
          'Paysafecard',
          'Payretailers',
          'Skrill',
          'Straal',
          'Sofort',
          'Trustpay',
          'WebRedirect',
          'Xpate'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('payment_methods', null, {})
  }
}
