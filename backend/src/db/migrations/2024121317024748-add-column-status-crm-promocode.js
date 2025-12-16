module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('crm_promotions', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.removeColumn('crm_promotions', 'is_active')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('crm_promotions', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })

    await queryInterface.removeColumn('crm_promotions', 'status')
  }
}
