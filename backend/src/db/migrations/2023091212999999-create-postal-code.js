'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('postal_codes', {
      postal_code_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_claimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      valid_to: {
        type: DataTypes.DATE,
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
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('postal_codes', { schema: 'public' })
  }
}
