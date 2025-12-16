'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('master_casino_games', 'admin_enabled_freespin', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })

    await queryInterface.addColumn('master_casino_providers', 'admin_enabled_freespin', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })

    await queryInterface.addColumn('master_game_aggregators', 'free_spin_allowed', {
      type: DataTypes.BOOLEAN,
      allowNull: true
    })

    await queryInterface.addColumn('master_game_aggregators', 'admin_enabled_freespin', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_casino_games', 'admin_enabled_freespin')
    await queryInterface.removeColumn('master_casino_providers', 'admin_enabled_freespin')
    await queryInterface.removeColumn('master_game_aggregators', 'free_spin_allowed')
    await queryInterface.removeColumn('master_game_aggregators', 'admin_enabled_freespin')
  }
}
