'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('master_casino_games', {
      master_casino_game_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      operator_status: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      is_active: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      is_demo_supported: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      demo_url: {
        allowNull: true,
        type: DataTypes.STRING
      },
      brand: {
        allowNull: true,
        type: DataTypes.STRING
      },
      brand_id: {
        allowNull: true,
        type: DataTypes.STRING
      },
      master_casino_provider_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'master_casino_providers',
            schema: 'public'
          },
          key: 'master_casino_provider_id'
        }
      },
      master_game_sub_category_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      identifier: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      has_freespins: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      restrictions: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      feature_group: {
        type: DataTypes.STRING,
        allowNull: true
      },
      devices: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      lines: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      return_to_player: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      wagering_contribution: {
        type: DataTypes.DOUBLE,
        defaultValue: 100
      },
      more_details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      order_id: {
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
    { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('master_casino_games', { schema: 'public' })
  }
}
