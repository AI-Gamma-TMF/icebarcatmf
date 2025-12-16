'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'user_tournament',
      {
        user_tournament_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        tournament_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        total_win: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: false,
          defaultValue: 0.0
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        is_winner: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        rank: {
          type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('user_tournament')
  }
}
