'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'preferred_payments',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        payment_method_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        payment_method_type: {
          allowNull: false,
          type: Sequelize.STRING
        },
        payment_used_count: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        total_payment_amount: {
          allowNull: false,
          type: Sequelize.FLOAT,
          defaultValue: 0
        },
        more_details: {
          type: Sequelize.JSON,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        schema: 'public'
      }
    )

    // Create a unique index to ensure a user has only one record per paymentMethodName.
    await queryInterface.addIndex('preferred_payments', ['user_id', 'payment_method_name'], {
      unique: true,
      name: 'preferred_payments_user_id_payment_method_name_unique'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('preferred_payments')
  }
}
