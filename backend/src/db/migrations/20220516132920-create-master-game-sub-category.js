'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('master_game_sub_categories', {
      master_game_sub_category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      master_game_category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'master_game_categories',
            schema: 'public'
          },
          key: 'master_game_category_id'
        }
      },
      order_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('master_game_sub_categories', { schema: 'public' })
  }
}
