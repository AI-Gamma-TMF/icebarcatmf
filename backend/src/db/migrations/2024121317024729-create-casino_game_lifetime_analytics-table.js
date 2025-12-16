'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('casino_game_lifetime_analytics', {
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      total_bets: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      total_wins: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      total_rounds: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('casino_game_analytics')
  }
}
