'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('provider_rate', {
      rate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      aggregator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ggr_minimum: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ggr_maximum: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate: {
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
    await queryInterface.dropTable('provider_rate', { schema: 'public' })
  }
}
