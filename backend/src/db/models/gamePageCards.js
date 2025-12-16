'use strict'

module.exports = (sequelize, DataTypes) => {
  const GamePageCards = sequelize.define(
    'GamePageCards',
    {
      gamePageCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
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
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      image: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'game_page_cards',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  GamePageCards.associate = function (model) {
    GamePageCards.belongsTo(model.GamePages, { foreignKey: 'gamePageId', onDelete: 'cascade' })
  }

  return GamePageCards
}
