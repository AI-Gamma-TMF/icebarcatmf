'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('email_logs', {
      email_log_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      email_template_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email_template_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true
      },
      more_details: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null
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
    await queryInterface.dropTable('email_logs', { schema: 'public' })
  }
}
