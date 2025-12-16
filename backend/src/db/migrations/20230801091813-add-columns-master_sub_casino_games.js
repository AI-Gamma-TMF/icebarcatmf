'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'master_game_sub_categories',
      schema: 'public'
    }, 'thumbnail_type',
    {
      type: Sequelize.STRING,
      defaultValue: 'short',
      allowNull: true
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'master_game_sub_categories',
      schema: 'public'
    }, 'thumbnail_type', Sequelize.STRING)
  }
}
