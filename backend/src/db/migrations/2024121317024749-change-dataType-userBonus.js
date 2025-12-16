'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('user_bonus', 'free_spin_amount', {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('user_bonus', 'free_spin_amount', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    })
  }
}
