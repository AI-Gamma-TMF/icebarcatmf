'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('email_templates', {
      email_template_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_primary: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dynamic_data: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      template_code: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('email_templates', { schema: 'public' })
  }
}
