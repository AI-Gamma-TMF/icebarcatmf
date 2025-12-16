'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('countries', {
      country_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      restricted_providers: {
        type: DataTypes.JSONB
      },
      restricted_games: {
        type: DataTypes.JSONB
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
    await queryInterface.dropTable('countries', { schema: 'public' })
  }
}
