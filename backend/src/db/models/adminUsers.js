'use strict'
import { ROLE } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    adminUserId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordSentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rememberCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    parentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rememberToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    adminUsername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authEnable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    scLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gcLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'admin_users',
    modelName: 'AdminUser',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  AdminUser.associate = function (models) {
    AdminUser.belongsTo(models.AdminRole, {
      foreignKey: 'roleId'
    })
    AdminUser.hasOne(models.AdminUserPermission, {
      as: 'userPermission',
      foreignKey: 'adminUserId',
      onDelete: 'cascade'
    })
    AdminUser.hasMany(models.ActivityLog, {
      foreignKey: 'actioneeId',
      sourceKey: 'adminUserId',
      scope: {
        actioneeType: ROLE.ADMIN
      },
      constraints: false
    })
    AdminUser.hasOne(models.ExportCenter, {
      as: 'exportCenter',
      foreignKey: 'adminUserId'
    })
    AdminUser.hasMany(models.VipManagerAssignment, {
      foreignKey: 'managerId',
      as: 'managedVips'
    })
    AdminUser.hasMany(models.UserInternalRating, {
      foreignKey: 'managedBy'
    })
  }
  return AdminUser
}
