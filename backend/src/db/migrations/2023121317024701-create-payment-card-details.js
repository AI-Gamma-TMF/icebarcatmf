'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_card', {
      payment_card_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT
      },
      expiry_month: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      expiry_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      holder_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      card_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      card_bin: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      card_last_digits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      card_category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      issuing_country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment_card')
  }
}
