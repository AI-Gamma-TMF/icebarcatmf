'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('notification_receivers', {
      notification_receiver_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      receiver_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'user adminUser'
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'notifications',
            schema: 'public'
          },
          key: 'notification_id'
        }
      },
      is_read: {
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
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('notification_receivers', { schema: 'public' })
  }
}
