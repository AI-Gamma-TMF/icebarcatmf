'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Delete all existing payment method records.
    await queryInterface.bulkDelete('payment_methods', null, {})

    // rename the column
    await queryInterface.renameColumn('payment_methods', 'payment_providers', 'payment_provider')

    // Change the column type of payment_providers from JSONB to STRING
    await queryInterface.changeColumn(
      { tableName: 'payment_methods', schema: 'public' },
      'payment_provider',
      {
        type: Sequelize.STRING,
        allowNull: true // adjust if needed
      }
    )

    // Add the new is_active column as BOOLEAN
    await queryInterface.addColumn(
      { tableName: 'payment_methods', schema: 'public' },
      'is_active',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true // adjust if you need a default or not-null constraint
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the is_active column
    await queryInterface.removeColumn(
      { tableName: 'payment_methods', schema: 'public' },
      'is_active'
    )

    // Revert the payment_providers column back to JSONB
    await queryInterface.changeColumn(
      { tableName: 'payment_methods', schema: 'public' },
      'payment_provider',
      {
        type: Sequelize.JSONB,
        allowNull: true // adjust if needed
      }
    )
  }
}
