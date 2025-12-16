'use strict'
const { USER_ACTIVITIES_TYPE } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_activities', {
      user_activity_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      activity_type: {
        type: DataTypes.ENUM(Object.values(USER_ACTIVITIES_TYPE)),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false
      },
      unique_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `${DataTypes.UUIDV4}`
      },
      ip_address: {
        type: DataTypes.INET,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      indexes: [
        {
          name: 'user_activity',
          fields: ['activity_type', 'user_id']
        }
      ],
      schema: 'public'
    })

    await queryInterface.addIndex('user_activities', ['activity_type', 'user_id'])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
