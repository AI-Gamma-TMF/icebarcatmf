module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('non_purchase_packages', 'no_of_purchases', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn('non_purchase_packages', 'last_purchased', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      queryInterface.addColumn('non_purchase_packages', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.removeColumn('non_purchase_packages', 'user_ids')
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('non_purchase_packages', 'no_of_purchases'),
      queryInterface.removeColumn('non_purchase_packages', 'last_purchased'),
      queryInterface.removeColumn('non_purchase_packages', 'deleted_at'),
      queryInterface.addColumn('non_purchase_packages', 'user_ids', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        defaultValue: []
      })
    ])
  }
}
