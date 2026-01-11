'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const providers = [
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
    ]

    const tableInfo = await queryInterface.describeTable('payment_methods')
    // Column was renamed to payment_provider in a later migration. Use whatever exists.
    const providerColumn = tableInfo.payment_provider ? 'payment_provider' : 'payment_providers'
    const providerValue = providerColumn === 'payment_provider'
      ? providers.join(',') // column is STRING now
      : JSON.stringify(providers) // legacy JSONB column

    await queryInterface.bulkInsert('payment_methods', [{
      method_name: 'PaymentIQ',
      [providerColumn]: providerValue,
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('payment_methods', null, {})
  }
}
