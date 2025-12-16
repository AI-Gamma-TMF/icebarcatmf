'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('notifications', {
      notification_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      sender_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'user adminUser'
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reference_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'For Withdrawal request, deposit etc'
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notification_message: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('notifications', { schema: 'public' })
  }
}
