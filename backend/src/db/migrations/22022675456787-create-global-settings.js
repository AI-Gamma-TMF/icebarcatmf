'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('global_settings', {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      value: {
        type: DataTypes.TEXT,
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
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('global_settings', { schema: 'public' })
  }
}
