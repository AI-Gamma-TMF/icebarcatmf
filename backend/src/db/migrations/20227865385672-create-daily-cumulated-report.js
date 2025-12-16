'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('daily_cumulative_report', {
      daily_cumulative_report_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      casino_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.00
      },
      report_date: {
        type: DataTypes.DATEONLY,
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
    await queryInterface.dropTable('daily_cumulative_report', { schema: 'public' })
  }
}
