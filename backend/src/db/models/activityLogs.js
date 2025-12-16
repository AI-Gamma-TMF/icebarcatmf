'use strict'

import { ROLE } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    activityLogId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    actioneeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actioneeType: {
      type: DataTypes.ENUM(Object.values(ROLE)),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true
    },
    fieldChanged: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    originalValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changedValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'activity_logs',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  ActivityLog.associate = function (models) {
    ActivityLog.belongsTo(models.AdminUser, {
      foreignKey: 'actioneeId',
      targetKey: 'adminUserId',
      as: 'admin',
      constraints: false
    })
    ActivityLog.belongsTo(models.User, {
      foreignKey: 'actioneeId',
      targetKey: 'userId',
      as: 'user',
      constraints: false
    })
  }

  return ActivityLog
}
