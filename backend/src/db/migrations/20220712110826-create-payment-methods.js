'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('payment_methods', {
      payment_method_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      method_name: {
        type: DataTypes.STRING
      },
      payment_providers: {
        type: DataTypes.JSONB
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
    await queryInterface.dropTable('payment_methods', { schema: 'public' })
  }
}
