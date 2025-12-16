'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('package', 'first_purchase_sc_bonus', {
      type: Sequelize.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    })
    await queryInterface.changeColumn('package', 'first_purchase_gc_bonus', {
      type: Sequelize.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('package', 'first_purchase_sc_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
    await queryInterface.changeColumn('package', 'first_purchase_gc_bonus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
  }
}
