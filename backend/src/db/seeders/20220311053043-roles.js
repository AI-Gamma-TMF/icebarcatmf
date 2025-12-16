'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('admin_roles', [
      {
        name: 'Admin',
        level: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Manager',
        level: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Support',
        level: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('admin_roles', null, {})
  }
}
