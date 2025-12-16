'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('admin_notifications', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'package', 'tournament', 'giveaway', 'high-stake-play'
      },
      subtype: {
        type: DataTypes.STRING // e.g., 'activation', 'launch', 'threshold-alert'
      },
      data: {
        type: DataTypes.JSONB, // Stores dynamic structured data
        allowNull: true
      },
      link: {
        type: DataTypes.STRING // Optional link to relevant admin panel page
      },
      image: {
        type: DataTypes.STRING // Optional image URL for notification
      },
      sender_type: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'admin'
      },
      sender_id: {
        type: DataTypes.STRING,
        allowNull: true // Nullable in case sender is system-generated
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: 'normal' // e.g., 'high', 'normal', 'low'
      },
      status: {
        type: DataTypes.JSONB,
        defaultValue: '[]', // Array of admin_user_id's who marked as read
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('admin_notifications')
  }
}
