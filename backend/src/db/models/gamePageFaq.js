'use strict'

module.exports = function (sequelize, DataTypes) {
  const GamePageFaq = sequelize.define(
    'GamePageFaq',
    {
      gamePageFaqId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      gamePageId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      orderId: {
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      tableName: 'game-page-faq',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  GamePageFaq.associate = function (models) {
    GamePageFaq.belongsTo(models.GamePages, {
      foreignKey: 'gamePageId', onDelete: 'cascade'
    })
  }

  return GamePageFaq
}
