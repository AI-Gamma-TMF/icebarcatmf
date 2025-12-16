'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('crm_promotions', 'more_details', {
      type: Sequelize.JSONB,
      allowNull: true
    })

    await queryInterface.addColumn('promo_codes', 'more_details', {
      type: Sequelize.JSONB,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('crm_promotions', 'more_details')
    await queryInterface.removeColumn('promo_codes', 'more_details')
  }
}
