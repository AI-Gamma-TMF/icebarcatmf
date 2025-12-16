'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('user_documents', {
      user_document_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      document_url: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 's3 urls'
      },
      document_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
        comment: '0- pending, 1-Approved, 2-Rejected'
      },
      actionee: {
        type: DataTypes.STRING,
        allowNull: true
      },
      action_performed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'reason for rejection if rejected'
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('user_documents', { schema: 'public' })
  }
}
