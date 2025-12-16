'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes', 'user_ids', {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
      allowNull: false,
      defaultValue: []
    })
    await queryInterface.addColumn('promo_codes', 'crm_promocode', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('promo_codes', 'user_ids')
    await queryInterface.removeColumn('promo_codes', 'crm_promocode')
  }
}
