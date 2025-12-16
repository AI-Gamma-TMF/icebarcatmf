'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('scratch_cards', 'deleted_at', {
      type: DataTypes.DATE,
      allowNull: true
    })
    await queryInterface.addColumn('scratch_cards', 'message', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('scratch_cards', 'daily_consumed_amount', {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    })
    await queryInterface.addColumn('scratch_cards', 'weekly_consumed_amount', {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    })
    await queryInterface.addColumn('scratch_cards', 'monthly_consumed_amount', {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('scratch_cards', 'deleted_at')
    await queryInterface.removeColumn('scratch_cards', 'message')
    await queryInterface.removeColumn('scratch_cards', 'daily_consumed_amount')
    await queryInterface.removeColumn('scratch_cards', 'weekly_consumed_amount')
    await queryInterface.removeColumn('scratch_cards', 'monthly_consumed_amount')
  }
}
