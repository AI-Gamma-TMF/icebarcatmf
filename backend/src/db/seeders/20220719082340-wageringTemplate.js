'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert({ tableName: 'wagering_templates', schema: 'public' }, [
      {
        name: 'DEFAULT',
        parent_type: 'admin',
        parent_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete({ tableName: 'wagering_templates', schema: 'public' }, null, {})
  }
}
