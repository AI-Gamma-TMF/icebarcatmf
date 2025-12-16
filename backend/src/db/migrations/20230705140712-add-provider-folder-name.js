'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'master_casino_providers',
      schema: 'public'
    }, 'folder_name',
    {
      type: Sequelize.STRING,
      allowNull: true
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'master_casino_providers',
      schema: 'public'
    }, 'folder_name', Sequelize.STRING)
  }
}
