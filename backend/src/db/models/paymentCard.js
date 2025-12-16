'use strict'

module.exports = (sequelize, DataTypes) => {
  const PaymentCard = sequelize.define(
    'PaymentCard',
    {
      paymentCardId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT
      },
      expiryMonth: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      expiryYear: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      holderName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cardType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cardBin: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cardLastDigits: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cardCategory: {
        type: DataTypes.STRING,
        allowNull: true
      },
      issuingCountry: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'payment_card',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  PaymentCard.associate = function (model) {}

  return PaymentCard
}
