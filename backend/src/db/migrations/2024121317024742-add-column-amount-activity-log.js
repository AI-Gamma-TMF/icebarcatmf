module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('activity_logs', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('activity_logs', 'amount')
  }
}
