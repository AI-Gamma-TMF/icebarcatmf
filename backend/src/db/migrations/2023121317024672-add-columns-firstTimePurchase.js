'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('package', 'first_purchase_sc_bonus', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    })

    await queryInterface.addColumn('package', 'first_purchase_gc_bonus', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'first_purchase_sc_bonus')
    await queryInterface.removeColumn('package', 'first_purchase_gc_bonus')
  }
}
