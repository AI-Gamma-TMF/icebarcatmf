'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('withdraw_requests', {
      withdraw_request_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      actionable_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      actionable_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      actioned_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      payment_provider: {
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
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('withdraw_requests', { schema: 'public' })
  }
}
