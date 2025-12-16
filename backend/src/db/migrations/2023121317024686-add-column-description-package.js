'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('package', 'welcome_purchase_percentage', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'welcome_purchase_percentage')
  }
}
