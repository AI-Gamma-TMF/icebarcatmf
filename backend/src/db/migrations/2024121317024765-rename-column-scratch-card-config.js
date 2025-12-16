'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.renameColumn('scratch_card_configuration', 'probability', 'percentage')
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.renameColumn('scratch_card_configuration', 'percentage', 'probability')
  }
}
