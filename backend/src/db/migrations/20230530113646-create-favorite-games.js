'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('favorite_games', {
      favorite_game_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      master_casino_game_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
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
    { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('favorite_games', { schema: 'public' })
  }
}
