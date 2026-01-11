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
      const fullPermissions = {
        Admins: ['C', 'R', 'U', 'T', 'D'],
        CMS: ['C', 'R', 'U', 'T', 'D'],
        Users: ['C', 'R', 'U', 'T', 'D'],
        Transactions: ['C', 'R', 'U', 'T', 'D'],
        Bonus: ['C', 'R', 'U', 'T', 'Issue', 'D'],
        CasinoManagement: ['C', 'R', 'U', 'T', 'D'],
        Banner: ['C', 'R', 'U', 'T', 'D'],
        Report: ['R', 'DR'],
        Configurations: ['C', 'R', 'U', 'T', 'D'],
        Tournaments: ['C', 'R', 'U', 'T', 'D'],
        Tiers: ['C', 'R', 'U', 'T', 'D'],
        Raffles: ['C', 'R', 'U', 'T', 'D'],
        RafflePayout: ['C', 'R', 'U', 'T', 'D'],
        PromotionBonus: ['C', 'R', 'U', 'T', 'D'],
        WalletCoin: ['C', 'R', 'U', 'D'],
        FraudUser: ['R'],
        Promocode: ['C', 'R', 'U', 'T', 'D'],
        PostalCode: ['C', 'R', 'U', 'D'],
        CrmPromotion: ['C', 'R', 'U', 'T', 'D'],
        ExportCenter: ['C', 'R', 'U', 'T', 'D'],
        DomainBlock: ['C', 'R', 'U', 'T', 'D'],
        BlockUsers: ['C', 'R', 'U', 'T', 'D'],
        emailCenter: ['C', 'R', 'U', 'T', 'D'],
        Amoe: ['C', 'R', 'U', 'D'],
        NotificationCenter: ['C', 'R', 'U', 'D'],
        AdminAddedCoins: ['C', 'R', 'U', 'D'],
        MaintenanceMode: ['C', 'R', 'U', 'D', 'T'],
        VipManagement: ['C', 'R', 'U', 'D', 'T', 'CR'],
        CashierManagement: ['C', 'R', 'U', 'T', 'D'],
        BlogPost: ['C', 'R', 'U', 'T', 'D'],
        Gallery: ['C', 'R', 'D'],
        Jackpot: ['C', 'R', 'U', 'D'],
        VipManagedBy: ['R', 'U'],
        PromotionThumbnail: ['C', 'R', 'U', 'D', 'T'],
        GamePages: ['C', 'R', 'U', 'D'],
        Calender: ['C', 'R', 'U', 'D'],
        Subscription: ['C', 'R', 'U', 'D'],
        ProviderDashboard: ['C', 'R', 'U', 'D'],
        PlayerLiabilityReport: ['C', 'R', 'U', 'T', 'D'],
        PlayerStatisticsReport: ['C', 'R', 'U', 'T', 'D'],
        LivePlayerReport: ['C', 'R', 'U', 'T', 'D'],
        KpiSummaryReport: ['C', 'R', 'U', 'T', 'D'],
        KpiReport: ['C', 'R', 'U', 'T', 'D'],
        Settings: ['C', 'R', 'U', 'T', 'D'],
        Alert: ['R']
      }
      await queryInterface.bulkInsert('admin_user_permissions', [{
        admin_user_id: adminId,
        permission: JSON.stringify(fullPermissions),
        created_at: new Date(),
        updated_at: new Date()
      }])
    }
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('admin_users', { email: 'admin@moneyfactory.com' })
  }
}
