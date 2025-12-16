'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('package', 'welcome_special_purchase_bonus', 'welcome_purchase_bonus_applicable_minutes')
    await queryInterface.changeColumn('package', 'package_type', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('package', 'welcome_purchase_bonus_applicable_minutes', 'welcome_special_purchase_bonus')
    await queryInterface.changeColumn('package', 'package_type', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
