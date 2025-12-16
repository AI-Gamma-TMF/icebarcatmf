'use strict'

module.exports = (sequelize, DataTypes) => {
  const BanUserSetting = sequelize.define('BanUserSetting', {
    reasonId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reasonTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reasonDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deactivateReason: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reasonCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ban_user_setting',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: true
  })

  BanUserSetting.associate = function (model) {

  }
  return BanUserSetting
}
