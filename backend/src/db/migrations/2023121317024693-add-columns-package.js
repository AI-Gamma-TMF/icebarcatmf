'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('package', 'more_details', {
      type: Sequelize.JSONB,
      allowNull: true
    })

    await queryInterface.addColumn('package', 'is_special_package', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'more_details')
    await queryInterface.removeColumn('package', 'is_special_package')
  }
}

