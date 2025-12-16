'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('package', 'purchase_no', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'purchase_no')
  }
}
