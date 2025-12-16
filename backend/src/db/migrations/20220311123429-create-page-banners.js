'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('page_banners', {
      page_banner_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      visibility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      desktop_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      mobile_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btn_redirection: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btn_text: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      page_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_one: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_two: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_three: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('page_banners', { schema: 'public' })
  }
}
