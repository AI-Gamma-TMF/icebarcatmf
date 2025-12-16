'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('admin_users', [{
      first_name: 'admin',
      last_name: 'One',
      email: 'admin@moneyfactory.com',
      password: '$2b$10$1GhQWm5AGZ1bFGOfB4Nlsu0owSkkLvn2QDSHssNovUQX8dw1JshRq',
      role_id: 1,
      is_active: true,
      admin_username: 'adminOne',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('admin_users', null, {})
  }
}
