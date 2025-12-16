'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('ban_user_setting', {
      reason_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      reason_title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reason_description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      deactivate_reason: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      reason_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('ban_user_setting', { schema: 'public' })
  }
}
