module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jackpots', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('jackpots', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('jackpots', 'start_date')
    await queryInterface.removeColumn('jackpots', 'end_date')
  }
}
