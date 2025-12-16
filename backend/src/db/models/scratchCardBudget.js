'use strict'

module.exports = (sequelize, DataTypes) => {
  const ScratchCardBudgetUsage = sequelize.define(
    'ScratchCardBudgetUsage',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      scratchCardId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      budgetType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      budgetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      periodStart: {
        allowNull: false,
        type: DataTypes.DATE
      },
      periodEnd: {
        allowNull: false,
        type: DataTypes.DATE
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'scratch_card_budget_usage',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  ScratchCardBudgetUsage.associate = function (models) {
    ScratchCardBudgetUsage.belongsTo(models.ScratchCards, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'scratchCards'
    })
  }

  return ScratchCardBudgetUsage
}
