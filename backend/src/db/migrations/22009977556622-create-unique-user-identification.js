'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('unique_user_identification', {
      unique_user_identification_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      unique_key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('unique_user_identification', { schema: 'public' })
  }
}
