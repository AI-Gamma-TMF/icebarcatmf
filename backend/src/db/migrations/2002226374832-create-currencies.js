'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('currencies', {
      currency_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      exchange_rate: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      symbol: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      loyalty_point: {
        type: DataTypes.DOUBLE,
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
    await queryInterface.dropTable('currencies', { schema: 'public' })
  }
}
