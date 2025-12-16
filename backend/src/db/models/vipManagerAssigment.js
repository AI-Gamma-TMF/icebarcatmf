'use strict'

module.exports = function (sequelize, DataTypes) {
  const VipManagerAssignment = sequelize.define(
    'VipManagerAssignment',
    {
      assignmentId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      managerId: {
        type: DataTypes.BIGINT, // references admin_users.adminUserId
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true // null means still active
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'vip_manager_assignments',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  )

  VipManagerAssignment.associate = function (models) {
    // Link to the VIP player
    VipManagerAssignment.belongsTo(models.User, { foreignKey: 'userId', as: 'vipPlayer' })

    // Link to the manager (AdminUser)
    VipManagerAssignment.belongsTo(models.AdminUser, {
      foreignKey: 'managerId',
      as: 'manager'
    })
  }

  return VipManagerAssignment
}
