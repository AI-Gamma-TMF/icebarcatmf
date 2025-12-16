'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('transaction_affiliates', {
      transaction_affiliate_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      affiliate_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      currency_code: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payment_details: {
        type: DataTypes.JSONB,
        allowNull: true
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
    await queryInterface.dropTable('transaction_affiliates', { schema: 'public' })
  }
}
