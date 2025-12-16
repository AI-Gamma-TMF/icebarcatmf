'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('package', 'purchase_limit_per_user', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
    await queryInterface.addColumn('package', 'welcome_purchase_bonus_applicable', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('package', 'welcome_special_purchase_bonus', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'purchase_limit_per_user')
    await queryInterface.removeColumn('package', 'welcome_purchase_bonus_applicable')
    await queryInterface.removeColumn('package', 'welcome_special_purchase_bonus')
  }
}
