'use strict'

const { ROLE } = require('../../utils/constants/constant')

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('activity_logs', {
      activity_log_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      actionee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      actionee_type: {
        type: DataTypes.ENUM(Object.values(ROLE)),
        allowNull: false
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true
      },
      field_changed: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      original_value: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      changed_value: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      more_details: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'checking:0, savings:1'
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
    await queryInterface.dropTable('activity_logs', { schema: 'public' })
  }
}
