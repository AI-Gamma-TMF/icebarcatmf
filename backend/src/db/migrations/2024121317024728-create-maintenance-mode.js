'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('maintenance_mode', {
      maintenance_mode_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      start_time: {
        allowNull: false,
        type: DataTypes.DATE
      },
      end_time: {
        allowNull: false,
        type: DataTypes.DATE
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      job_id: {
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
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('maintenance_mode')
  }
}
