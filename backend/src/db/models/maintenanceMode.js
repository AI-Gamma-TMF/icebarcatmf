'use strict'

module.exports = (sequelize, DataTypes) => {
  const MaintenanceMode = sequelize.define(
    'MaintenanceMode',
    {
      maintenanceModeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      jobId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'maintenance_mode',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  // define association here:
  MaintenanceMode.associate = function (model) {}

  return MaintenanceMode
}
