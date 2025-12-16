'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('admin_user_permissions', [
      {
        admin_user_id: 1,
        permission: JSON.stringify({
          Admins: ['C', 'R', 'U', 'T', 'D'],
          CMS: ['C', 'R', 'U', 'T', 'D'],
          Users: ['C', 'R', 'U', 'T', 'D'],
          Transactions: ['C', 'R', 'U', 'T', 'D'],
          Bonus: ['C', 'R', 'U', 'T', 'D', 'Issue'],
          KycLabel: ['C', 'R', 'U', 'T', 'D'],
          CasinoManagement: ['C', 'R', 'U', 'T', 'D'],
          LivePlayerReport: ['C', 'R', 'U', 'T', 'D'],
          PlayerStatisticsReport: ['C', 'R', 'U', 'T', 'D'],
          PlayerLiabilityReport: ['C', 'R', 'U', 'T', 'D'],
          Banner: ['C', 'R', 'U', 'T', 'D'],
          GameReport: ['C', 'R', 'U', 'T', 'D'],
          EmailTemplate: ['C', 'R', 'U', 'TE', 'D'],
          Package: ['C', 'R', 'U', 'D'],
          Report: ['R']
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('admin_user_permissions', null, {})
  }
}
