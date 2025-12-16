'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('crm_promotions', 'valid_from', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('promo_codes', 'valid_from', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('user_bonus', 'valid_from', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('crm_promotions', 'valid_from')
    await queryInterface.removeColumn('promo_codes', 'valid_from')
    await queryInterface.removeColumn('user_bonus', 'valid_from')
  }
}
