'use strict'
module.exports = function (sequelize, DataTypes) {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    paymentMethodId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    methodName: {
      type: DataTypes.STRING
    },
    paymentProvider: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    tableName: 'payment_methods',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return PaymentMethod
}
