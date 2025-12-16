'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blog_posts_game_pages', {
      blog_post_game_page_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      game_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'game_pages',
          key: 'game_page_id'
        },
        onDelete: 'CASCADE'
      },
      blog_post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'blog_post',
          key: 'blog_post_id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('blog_posts_game_pages')
  }
}
