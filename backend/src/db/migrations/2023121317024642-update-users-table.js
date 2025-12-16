'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.removeColumn('users', 'is_lexis_nexis_verified'),
      queryInterface.removeColumn('users', 'ssn_applicant_id'),
      queryInterface.removeColumn('users', 'ssn_status'),
      queryInterface.removeColumn('users', 'veriff_status'),
      queryInterface.removeColumn('users', 'ssn'),
      queryInterface.removeColumn('users', 'ssn_update_count')
    ])

    await queryInterface.addColumn(
      {
        tableName: 'users',
        schema: 'public'
      },
      'sumsub_kyc_status',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'sumsub_kyc_status')
  }
}
