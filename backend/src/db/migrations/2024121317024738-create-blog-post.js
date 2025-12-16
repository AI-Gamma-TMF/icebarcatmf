'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('blog_post', {
      blog_post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      meta_title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      meta_description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      post_heading: {
        type: DataTypes.STRING,
        allowNull: false
      },
      banner_image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      banner_image_alt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      content_body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_popular_blog: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('blog_post')
  }
}
