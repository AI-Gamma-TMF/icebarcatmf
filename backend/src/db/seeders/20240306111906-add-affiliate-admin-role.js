'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('admin_roles', [
      {
        name: 'Affiliate',
        level: 4,
        created_at: new Date(),
        updated_at: new Date()
      }

    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('admin_roles', null, {})
  }
}
