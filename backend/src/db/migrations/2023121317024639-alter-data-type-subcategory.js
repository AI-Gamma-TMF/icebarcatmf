'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.removeColumn(
      {
        tableName: 'master_game_sub_categories',
        schema: 'public'
      },
      'image_url'
    )

    await queryInterface.addColumn(
      {
        tableName: 'master_game_sub_categories',
        schema: 'public'
      },
      'image_url',
      {
        type: DataTypes.JSONB,
        defaultValue: { headerThumbnail: '', sidebarThumbnail: '' },
        allowNull: true
      }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn(
      {
        tableName: 'master_game_sub_categories',
        schema: 'public'
      },
      'image_url'
    )
    
    await queryInterface.addColumn(
      {
        tableName: 'master_game_sub_categories',
        schema: 'public'
      },
      'image_url',
      {
        type: DataTypes.STRING,
        allowNull: true
      }
    )
  }
}
