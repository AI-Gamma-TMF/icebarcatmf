'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('redeem_rule', 'player_ids', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('redeem_rule', 'player_ids')
  }
}
