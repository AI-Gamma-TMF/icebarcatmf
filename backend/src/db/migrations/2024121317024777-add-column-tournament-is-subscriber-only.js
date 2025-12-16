'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('tournament', 'is_subscriber_only', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tournament', 'is_subscriber_only')
  }
}
