'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('game_pages', 'meta_title', {
      type: DataTypes.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('game_pages', 'meta_description', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('game_pages', 'meta_title')
    await queryInterface.removeColumn('game_pages', 'meta_description')
  }
}
