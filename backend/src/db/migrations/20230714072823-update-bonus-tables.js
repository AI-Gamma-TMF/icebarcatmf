'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'image_url', Sequelize.String)

    await queryInterface.addColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'image_url',
    {
      type: Sequelize.JSONB,
      allowNull: true
    }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'image_url', Sequelize.JSONB)

    await queryInterface.addColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'image_url',
    {
      type: Sequelize.String,
      allowNull: true
    }
    )
  }
}
