'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('languages', {
      language_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_active: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('languages', { schema: 'public' })
  }
}
