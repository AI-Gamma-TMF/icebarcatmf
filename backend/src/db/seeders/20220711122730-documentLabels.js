'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('document_labels', [
      {
        name: JSON.stringify({ EN: 'Identity Proof' }),
        is_required: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: JSON.stringify({ EN: 'Proof of Address' }),
        is_required: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: JSON.stringify({ EN: 'Bank Statement' }),
        is_required: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('document_labels', null, {})
  }
}
