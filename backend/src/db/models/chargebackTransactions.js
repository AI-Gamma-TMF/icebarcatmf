'use strict'

module.exports = (sequelize, DataTypes) => {
  const ChargebackTransactions = sequelize.define(
    'ChargebackTransactions',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      chargebackId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      chargebackUuid: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      arn: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cardScheme: {
        type: DataTypes.STRING,
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      postingDate: {
        type: DataTypes.STRING,
        allowNull: false
      },
      psp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reasonCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pspStatus: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transactionCreatedDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      shouldFight: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      additionalData: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'chargeback_transactions',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  return ChargebackTransactions
}
