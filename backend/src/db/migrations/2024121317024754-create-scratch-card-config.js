'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('scratch_card_configuration', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      scratch_card_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scratch_card_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      min_reward: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      max_reward: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      reward_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['SC', 'GC']]
        }
      },
      probability: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      player_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_allow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('scratch_card_configuration', { schema: 'public' })
  }
}
