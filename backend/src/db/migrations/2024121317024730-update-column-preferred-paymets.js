module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('preferred_payments', 'split_token', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('preferred_payments', 'authorized_transaction_id', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('preferred_payments', 'split_token'),
      queryInterface.removeColumn('preferred_payments', 'authorized_transaction_id')
    ])
  }
}
