'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_gameplay_history', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tournament_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      more_details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('user_gameplay_history')
  }
}
