'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('withdraw_requests', 'is_approved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })

    await queryInterface.addColumn('withdraw_requests', 'last_run_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('withdraw_requests', 'is_approved')
    await queryInterface.removeColumn('withdraw_requests', 'last_run_at')
  }
}

