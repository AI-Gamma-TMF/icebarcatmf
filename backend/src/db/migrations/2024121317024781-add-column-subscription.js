'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscriptions', 'is_trial_allowed')

    await queryInterface.removeColumn('subscriptions', 'duration_days')
    await queryInterface.addColumn('subscriptions', 'yearly_amount', {
      type: Sequelize.DOUBLE,
      allowNull: true
    })
    await queryInterface.renameColumn('subscriptions', 'amount', 'monthly_amount')

    await queryInterface.addColumn('subscriptions', 'weekly_purchase_count', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscriptions', 'is_trial_allowed', {
      type: Sequelize.BOOLEAN,
      allowNull: false // or false, depending on original schema
    })

    await queryInterface.addColumn('subscriptions', 'duration_days', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.removeColumn('subscriptions', 'yearly_amount')

    await queryInterface.renameColumn('subscriptions', 'monthly_amount', 'amount')

    await queryInterface.removeColumn('subscriptions', 'weekly_purchase_count')
  }
}
