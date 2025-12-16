'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('game_monthly_discount', {
      game_monthly_discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      master_casino_game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_month_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_month_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      discount_percentage: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('game_monthly_discount')
  }
}
