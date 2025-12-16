'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'email_center',
      {
        email_template_id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        template_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        subject_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        content_html: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true
        },
        dynamic_fields: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      { schema: 'public' }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('email_center', { schema: 'public' })
  }
}
