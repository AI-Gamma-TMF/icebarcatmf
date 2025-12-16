'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return Promise.all([
      queryInterface.addColumn('whale_players', 'vip_questionnaire_bonus_count', {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('whale_players', 'vip_questionnaire_bonus_amount', {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('whale_players', 'vip_questionnaire_bonus_count'),
      queryInterface.removeColumn('whale_players', 'vip_questionnaire_bonus_amount')
    ])
  }
}
