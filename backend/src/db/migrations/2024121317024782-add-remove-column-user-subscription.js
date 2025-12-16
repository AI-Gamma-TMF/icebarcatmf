'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_subscriptions', 'trial_plan')

    await queryInterface.addColumn('user_subscriptions', 'plan_type', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_subscriptions', 'trial_plan', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })

    await queryInterface.removeColumn('user_subscriptions', 'plan_type')
  }
}
