'use strict'

module.exports = (sequelize, DataTypes) => {
  const ScratchCards = sequelize.define(
    'ScratchCards',
    {
      scratchCardId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      scratchCardName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dailyConsumedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      weeklyConsumedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      monthlyConsumedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'scratch_cards',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  ScratchCards.associate = function (models) {
    ScratchCards.hasMany(models.ScratchCardConfiguration, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'scratchCardConfigs'
    })
    ScratchCards.belongsTo(models.Package, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'packages'
    })
    ScratchCards.belongsTo(models.Bonus, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'bonus'
    })
    ScratchCards.belongsTo(models.UserBonus, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'userBonus'
    })
    ScratchCards.hasMany(models.ScratchCardBudgetUsage, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'scratchCardBudgets'
    })
  }

  return ScratchCards
}
