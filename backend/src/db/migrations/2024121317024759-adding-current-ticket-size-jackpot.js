'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jackpots', 'ticket_sold', {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('jackpots', 'ticket_sold')
    ])
  }
}
