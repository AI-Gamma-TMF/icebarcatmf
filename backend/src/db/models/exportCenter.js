'use strict'

import { EXPORT_CSV_STATUS } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const ExportCenter = sequelize.define(
    'ExportCenter',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      adminUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: EXPORT_CSV_STATUS.PENDING
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parentExportId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'export_center',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  ExportCenter.associate = function (model) {
    ExportCenter.belongsTo(model.AdminUser, {
      foreignKey: 'adminUserId',
      as: 'adminUser'
    })
    ExportCenter.belongsTo(model.ExportCenter, {
      foreignKey: 'parentExportId',
      as: 'parentExport'
    })
    ExportCenter.hasMany(model.ExportCenter, {
      foreignKey: 'parentExportId',
      as: 'childExports'
    })
  }

  return ExportCenter
}
