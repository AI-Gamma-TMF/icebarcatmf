'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_internal_rating', 'vip_approved_date', {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn('user_internal_rating', 'vip_revoked_date', {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn('user_internal_rating', 'managed_by_assignment_date', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('user_internal_rating', 'vip_approved_date'),
      queryInterface.removeColumn('user_internal_rating', 'managed_by_assignment_date'),
      queryInterface.removeColumn('user_internal_rating', 'vip_revoked_date')
    ])
  }
}
