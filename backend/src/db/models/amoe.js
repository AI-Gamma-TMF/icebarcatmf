'use strict'

import { AMOE_BONUS_STATUS } from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const Amoe = sequelize.define('Amoe', {
    amoeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    entryId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: AMOE_BONUS_STATUS.PENDING
    },
    scannedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registeredDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
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
  }, {
    sequelize,
    tableName: 'amoe',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Amoe.associate = function (model) {
    Amoe.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: false
    })
  }

  return Amoe
}
