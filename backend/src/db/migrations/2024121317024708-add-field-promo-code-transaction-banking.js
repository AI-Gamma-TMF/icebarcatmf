module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_bankings', 'promocode_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaction_bankings', 'promocode_id')
  }
}
