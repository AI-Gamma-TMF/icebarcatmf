'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('scratch_card_budget_usage', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      scratch_card_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      budget_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      budget_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      period_start: {
        allowNull: false,
        type: DataTypes.DATE
      },
      period_end: {
        allowNull: false,
        type: DataTypes.DATE
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('scratch_card_budget_usage', { schema: 'public' })
  }
}
