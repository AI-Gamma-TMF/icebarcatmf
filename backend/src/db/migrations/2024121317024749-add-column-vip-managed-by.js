'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_internal_rating', 'managed_by', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_internal_rating', 'managed_by')
  }
}
