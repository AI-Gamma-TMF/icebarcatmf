'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.addColumn(
        {
          tableName: 'export_center',
          schema: 'public'
        },
        'admin_user_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: 'admin_users',
              schema: 'public'
            },
            key: 'admin_user_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      ),
      queryInterface.addColumn(
        {
          tableName: 'export_center',
          schema: 'public'
        },
        'payload',
        {
          type: Sequelize.JSONB,
          allowNull: true
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        tableName: 'export_center',
        schema: 'public'
      },
      'admin_user_id',
      Sequelize.INTEGER
    )
    await queryInterface.removeColumn(
      {
        tableName: 'export_center',
        schema: 'public'
      },
      'payload',
      Sequelize.JSONB
    )
  }
}
