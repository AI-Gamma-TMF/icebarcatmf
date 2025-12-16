'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'user_bonus',
      'cancelled_by',
      'freespin_campaign_id'
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'user_bonus',
      'cancelled_by',
      'freespin_campaign_id'
    )
  }
}
