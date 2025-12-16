'use strict'
module.exports = function (sequelize, DataTypes) {
  const PageContent = sequelize.define('PageContent', {
    pageId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    pageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seoDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Value will be an object containing SEO title, description and keywords'
    },
    /*
    page assets
      e.g. text_assets value:
      {
        "about_us_heading": {
          "content": "<h3>About Us</h3>",
          "asset": 1
        },
        ...
      }
    */
    assets: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'page_content',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  return PageContent
}
