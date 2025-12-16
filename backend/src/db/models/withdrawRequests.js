'use strict'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const WithdrawRequest = sequelize.define('WithdrawRequest', {
    withdrawRequestId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: TRANSACTION_STATUS.PENDING
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionableEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionableId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actionedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentProvider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ruleId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approvalTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ruleDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'withdraw_requests',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  WithdrawRequest.associate = function (model) {
    WithdrawRequest.belongsTo(model.User, { foreignKey: 'userId' })
  }

  return WithdrawRequest
}
