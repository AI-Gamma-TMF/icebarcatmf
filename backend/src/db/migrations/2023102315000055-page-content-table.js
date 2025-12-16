'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('page_content', {
      page_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      page_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seo_details: {
        type: Sequelize.JSONB,
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
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'assetType values will be 1 for text asset, 2 for digital asset, 3 for message assets'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('page_content')
  }
}
