'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_game_aggregators', 'is_hidden', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })

    await queryInterface.addColumn('master_casino_providers', 'is_hidden', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })

    await queryInterface.addColumn('master_casino_games', 'is_hidden', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_game_aggregators', 'is_hidden')
    await queryInterface.removeColumn('master_casino_providers', 'is_hidden')
    await queryInterface.removeColumn('master_casino_games', 'is_hidden')
  }
}
