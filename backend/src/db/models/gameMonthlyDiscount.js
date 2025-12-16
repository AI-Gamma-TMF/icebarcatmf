'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameMonthlyDiscount = sequelize.define(
    'GameMonthlyDiscount',
    {
      gameMonthlyDiscountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      masterCasinoGameId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startMonthDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endMonthDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      discountPercentage: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'game_monthly_discount',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  GameMonthlyDiscount.associate = function (models) {
  }

  return GameMonthlyDiscount
}
