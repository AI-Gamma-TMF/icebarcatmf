'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const email = 'admin@moneyfactory.com'
    // Delete existing admin with same email, then reinsert with known password
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
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('admin_users', { email: 'admin@moneyfactory.com' })
  }
}
