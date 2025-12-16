'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('user_bonus', 'scratch_card_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_bonus', 'scratch_card_id')
  }
}
