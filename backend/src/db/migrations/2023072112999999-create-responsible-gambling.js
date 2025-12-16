'use strict'

const { RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_LIMIT, RESPONSIBLE_GAMBLING_TYPE } = require('../../utils/constants/constant')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('responsible_gambling', {
      responsible_gambling_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      session_reminder_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Selected session reminder interval in hours'
      },
      status: {
        type: Sequelize.ENUM(Object.values(RESPONSIBLE_GAMBLING_STATUS)),
        allowNull: false,
        comment: 'active:1, in-active:0, cooling-period:2'
      },
      limit_type: {
        type: Sequelize.ENUM(Object.values(RESPONSIBLE_GAMBLING_LIMIT)),
        allowNull: true,
        comment: 'daily-1, weekly:2, monthly:3'
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      time_break_duration: {
        type: Sequelize.DATE,
        allowNull: true
      },
      self_exclusion: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      responsible_gambling_type: {
        type: Sequelize.ENUM(Object.values(RESPONSIBLE_GAMBLING_TYPE)),
        allowNull: true,
        comment: 'session:1, purchase:2, time:3, time_break:4, self_execution:4'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('responsible_gaming', { schema: 'public' })
  }
}
