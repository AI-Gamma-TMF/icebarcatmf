'use strict'

module.exports = (sequelize, DataTypes) => {
  const PreferredPayment = sequelize.define('PreferredPayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      // Assuming you have a Users table with an integer primary key
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethodName: {
      // e.g., 'ApplePay', 'Skrill', '9689_CARD', '9589_PAY_BY_BANK_PAYSAFE, 9589_PAY_BY_BANK_TRUSTLY '
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentMethodType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentUsedCount: {
      // Number of times this payment method was used successfully
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalPaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    splitToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authorizedTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moreDetails: {
      // Store full object details for cards or payByBank methods
      type: DataTypes.JSON,
      allowNull: true
    },
    recurringUserSubscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    schema: 'public',
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: 'preferred_payments',
    indexes: [
      {
        // Ensure a user has only one record per paymentMethodName
        unique: true,
        fields: ['userId', 'paymentMethodName']
      }
    ]
  })

  PreferredPayment.associate = function (model) {
    PreferredPayment.belongsTo(model.User, { foreignKey: 'userId', constraints: null })
  }

  return PreferredPayment
}
