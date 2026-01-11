'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const email = 'admin@moneyfactory.com'
    // Remove dependent permissions first to satisfy FK, then remove the admin row
    await queryInterface.sequelize.query(
      `DELETE FROM admin_user_permissions
       WHERE admin_user_id IN (SELECT admin_user_id FROM admin_users WHERE email = :email);`,
      { replacements: { email } }
    )
    await queryInterface.bulkDelete('admin_users', { email })
    await queryInterface.bulkInsert('admin_users', [{
      first_name: 'admin',
      last_name: 'One',
      email,
      // Password = Admin@123!
      password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m',
      role_id: 1,
      is_active: true,
      admin_username: 'adminOne',
      created_at: new Date(),
      updated_at: new Date()
    }])

    // Recreate permissions for this admin (full access similar to initial seed)
    const [rows] = await queryInterface.sequelize.query(
      `SELECT admin_user_id FROM admin_users WHERE email = :email LIMIT 1`,
      { replacements: { email } }
    )
    const adminId = rows?.[0]?.admin_user_id
    if (adminId) {
      await queryInterface.bulkInsert('admin_user_permissions', [{
        admin_user_id: adminId,
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
          Report: ['R'],
          Alert: ['R']
        }),
        created_at: new Date(),
        updated_at: new Date()
      }])
    }
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('admin_users', { email: 'admin@moneyfactory.com' })
  }
}
