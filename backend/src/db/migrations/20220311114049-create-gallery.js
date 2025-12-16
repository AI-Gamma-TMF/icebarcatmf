'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('gallery', {
      image_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING,
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
    },
    { schema: 'public' }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('gallery', { schema: 'public' })
  }
}
