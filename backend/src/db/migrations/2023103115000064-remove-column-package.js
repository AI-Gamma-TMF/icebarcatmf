'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'package',
      schema: 'public'
    }, 'text_color', Sequelize.STRING)

    await queryInterface.removeColumn({
      tableName: 'package',
      schema: 'public'
    }, 'background_color', Sequelize.STRING)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'package',
      schema: 'public'
    }, 'text_color', Sequelize.FLOAT)

    await queryInterface.addColumn({
      tableName: 'package',
      schema: 'public'
    }, 'background_color', Sequelize.Integer)
  }
}
