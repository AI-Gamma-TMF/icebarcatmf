'use strict'

module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define(
    'BlogPost',
    {
      blogPostId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: false
      },
      schema: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postHeading: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bannerImageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bannerImageAlt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contentBody: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isPopularBlog: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'blog_post',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  BlogPost.associate = function (model) {
    BlogPost.hasMany(model.Faq, { foreignKey: 'blogPostId', onDelete: 'cascade' })
    BlogPost.belongsToMany(model.GamePages, {
      through: model.BlogPostGamePage,
      foreignKey: 'blogPostId',
      otherKey: 'gamePageId',
      as: 'gamePages'
    })
  }

  return BlogPost
}
