'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('redeem_rule', 'is_subscriber_only', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('redeem_rule', 'is_subscriber_only')
  }
}
