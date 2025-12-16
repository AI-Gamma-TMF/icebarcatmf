'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_bonus', 'free_spin_amount_left', {
      type: Sequelize.DOUBLE,
      allowNull: true
    })

    await queryInterface.addColumn('user_bonus', 'free_rounds_left', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_bonus', 'free_spin_amount_left')
    await queryInterface.removeColumn('user_bonus', 'free_rounds_left')
  }
}
