'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      coin_type: {
        type: Sequelize.ENUM('GC', 'SC'),
        allowNull: false
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      setting: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    })

    await queryInterface.addIndex('game_settings', ['provider_id', 'coin_type', 'game_id'], {
      unique: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('game_settings', ['provider_id', 'coin_type', 'game_id'])
    await queryInterface.dropTable('game_settings')
  }
}
