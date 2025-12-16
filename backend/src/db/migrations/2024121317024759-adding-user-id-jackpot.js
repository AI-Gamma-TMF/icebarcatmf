'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jackpots', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('jackpots', 'user_id')
    ])
  }
}
