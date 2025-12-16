'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const emailCenterExists = await queryInterface
      .describeTable('email_center')
      .then(() => true)
      .catch(() => false)

    if (emailCenterExists) {
      await queryInterface.dropTable('email_center', {
        schema: 'public',
        cascade: true
      })
    }

    const emailTemplatesExists = await queryInterface
      .describeTable('email_templates')
      .then(() => true)
      .catch(() => false)

    if (emailTemplatesExists) {
      await queryInterface.dropTable('email_templates', {
        schema: 'public',
        cascade: true
      })
    }

    // Create the 'email_templates' table
    await queryInterface.createTable(
      'email_templates',
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

  }
}
