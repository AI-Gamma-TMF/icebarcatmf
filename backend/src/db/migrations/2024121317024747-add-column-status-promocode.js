module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.removeColumn('promo_codes', 'is_active')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })

    await queryInterface.removeColumn('promo_codes', 'status')
  }
}
