'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('cms_pages', {
      cms_page_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      category: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
    await queryInterface.dropTable('cms_pages', { schema: 'public' })
  }
}
