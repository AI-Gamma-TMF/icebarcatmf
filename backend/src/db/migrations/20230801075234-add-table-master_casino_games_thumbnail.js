'use strict'
const { THUMBNAIL_TYPE } = require('../../utils/constants/constant')
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('master_casino_games_thumbnail', {
      thumbnail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      master_casino_game_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'master_casino_games',
            schema: 'public'
          },
          key: 'master_casino_game_id'
        }
      },
      thumbnail_type: {
        type: DataTypes.ENUM(Object.values(THUMBNAIL_TYPE)),
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_casino_games_thumbnail', { schema: 'public' })
  }
}
