'use strict'

import { BANK_ACCOUNT_TYPE } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const BankDetail = sequelize.define('BankDetail', {
    bankDetailId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    routingNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    holderName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(Object.values(BANK_ACCOUNT_TYPE)),
      allowNull: false,
      comment: 'checking:0, savings:1'
    }
  },
  {
    sequelize,
    tableName: 'bank_details',
    schema: 'public',
    timestamps: true,
    underscored: true

  })

  return BankDetail
}
