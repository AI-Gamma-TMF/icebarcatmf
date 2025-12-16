'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('player_groups', {
      group_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_ids: {
        type: DataTypes.JSONB,
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
    },
    { schema: 'public' }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('player_groups', { schema: 'public' })
  }
}
