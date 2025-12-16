'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promotion_thumbnails', 'navigate_route', {
      type: Sequelize.STRING(255),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('promotion_thumbnails', 'navigate_route')
  }
}
