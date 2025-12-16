'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_subcategory', {
      game_subcategory_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      master_casino_game_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'master_casino_games',
            schema: 'public'
          },
          key: 'master_casino_game_id'
        }
      },
      master_game_sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'master_game_sub_categories',
            schema: 'public'
          },
          key: 'master_game_sub_category_id'
        }
      },
      order_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }

    }, {
      schema: 'public'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('game_subcategory', { schema: 'public' })
  }
}
