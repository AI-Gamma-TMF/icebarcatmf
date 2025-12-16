'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'tournament',
      {
        tournament_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        entry_amount: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true
        },
        entry_coin: {
          type: DataTypes.STRING,
          allowNull: false
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        game_id: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true
        },
        win_gc: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true
        },
        win_sc: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true
        },
        player_limit: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        winner_percentages:{
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: false,
          defaultValue: [100]
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
        },
      },
      {
        schema: 'public'
      }
    )
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('tournament')
  }
}
