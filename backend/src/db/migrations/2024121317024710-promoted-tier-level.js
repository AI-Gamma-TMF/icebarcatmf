'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users_tiers', 'promoted_tier_level', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users_tiers', 'promoted_tier_level')
  }
}
