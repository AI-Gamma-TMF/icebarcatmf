'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game-page-faq', {
      game_page_faq_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      game_page_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      required: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      more_details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('game-page-faq')
  }
}
