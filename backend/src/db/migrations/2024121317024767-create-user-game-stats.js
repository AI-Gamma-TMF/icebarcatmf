'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('user_game_stats', {
      user_game_stats_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
      },
      last_synced_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      top_10_wins: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      top_10_games_by_bet_count: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      top_5_provider: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('user_game_stats', { schema: 'public' })
  }
}
