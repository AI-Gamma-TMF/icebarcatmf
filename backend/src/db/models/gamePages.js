'use strict'

module.exports = (sequelize, DataTypes) => {
  const GamePages = sequelize.define(
    'GamePages',
    {
      gamePageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'game_page_id'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      heading: {
        type: DataTypes.STRING,
        allowNull: true
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      htmlContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'html_content'
      },
      schema: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'schema'
      },
      endContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'end_content'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        field: 'is_active'
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'order_id'
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'more_details'
      },
      image: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'game_pages',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  GamePages.associate = function (model) {
    GamePages.hasMany(model.GamePageFaq, { foreignKey: 'gamePageId', onDelete: 'cascade' })
    GamePages.hasMany(model.GamePageCards, { foreignKey: 'gamePageId', onDelete: 'cascade' })
    GamePages.belongsToMany(model.BlogPost, {
      through: model.BlogPostGamePage,
      foreignKey: 'gamePageId',
      otherKey: 'blogPostId',
      as: 'blogPosts'
    })
  }

  return GamePages
}
