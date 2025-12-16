'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('document_labels', {
      document_label_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('document_labels', { schema: 'public' })
  }
}
