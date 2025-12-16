'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('configurations', {
      configuration_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      allowed_currencies: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      loyalty_level: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      loyalty_point: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      allowed_languages: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      banner_url: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('configurations', { schema: 'public' })
  }
}
