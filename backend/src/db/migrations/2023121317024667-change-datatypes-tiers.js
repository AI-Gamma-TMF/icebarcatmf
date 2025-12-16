'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('tiers', 'weekly_bonus_percentage', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    })

    await queryInterface.changeColumn('tiers', 'monthly_bonus_percentage', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    })
    // Add new columns
    await queryInterface.addColumn('tiers', 'is_weekely_bonus_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
    await queryInterface.addColumn('tiers', 'is_monthly_bonus_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('tiers', 'weekly_bonus_percentage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })

    await queryInterface.changeColumn('tiers', 'monthly_bonus_percentage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  }
}
