'use strict'

module.exports = (sequelize, DataTypes) => {
  const BlogPostGamePage = sequelize.define(
    'BlogPostGamePage',
    {
      blogPostGamePageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'blog_post_game_page_id'
      },
      gamePageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'game_page_id',
        references: {
          model: 'game_pages',
          key: 'game_page_id'
        },
        onDelete: 'CASCADE'
      },
      blogPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'blog_post_id',
        references: {
          model: 'blog_post',
          key: 'blog_post_id'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      tableName: 'blog_posts_game_pages',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['game_page_id', 'blog_post_id'],
          name: 'unique_game_page_blog_post'
        }
      ]
    }
  )
  BlogPostGamePage.associate = function (models) {
    BlogPostGamePage.belongsTo(models.BlogPost, {
      foreignKey: 'blogPostId',
      as: 'blogPost'
    })
    BlogPostGamePage.belongsTo(models.GamePages, {
      foreignKey: 'gamePageId',
      as: 'gamePage'
    })
  }

  return BlogPostGamePage
}
