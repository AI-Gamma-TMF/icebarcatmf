'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('admin_user_permissions', {
      admin_user_permission_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin_users',
          key: 'admin_user_id'
        }
      },
      permission: {
        type: DataTypes.JSONB,
        allowNull: false
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
    await queryInterface.dropTable('admin_user_permissions', { schema: 'public' })
  }
}
