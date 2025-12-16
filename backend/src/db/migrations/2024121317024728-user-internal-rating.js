'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'user_internal_rating',
      {
        user_internal_rating_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        rating: {
          type: DataTypes.INTEGER, // 0-5
          allowNull: true
        },
        score: {
          type: DataTypes.DOUBLE(10, 2), // 0-5
          allowNull: true,
          defaultValue: 0.0
        },
        vip_status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        more_details: {
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
      },
      {
        schema: 'public'
      }
    )
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('user_internal_rating')
  }
}
