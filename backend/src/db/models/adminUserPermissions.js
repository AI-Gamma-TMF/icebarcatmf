'use strict'
module.exports = (sequelize, DataTypes) => {
  const AdminUserPermission = sequelize.define('AdminUserPermission', {
    adminUserPermissionId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    adminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'admin_user_permissions',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  AdminUserPermission.associate = function (models) {
    AdminUserPermission.belongsTo(models.AdminUser, {
      foreignKey: 'adminUserId'
    })
  }
  return AdminUserPermission
}
