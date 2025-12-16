'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'blocked_users',
      {
        user_id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.INTEGER,
          references: {
            model: {
              tableName: 'users',
              schema: 'public'
            },
            key: 'user_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        is_avail_promocode_blocked: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        }
      },
      { schema: 'public' }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blocked_users', { schema: 'public' })
  }
}
