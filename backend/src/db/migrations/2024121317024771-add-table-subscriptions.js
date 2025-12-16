'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      subscription_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_trial_allowed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      sc_coin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      gc_coin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      platform: {
        type: Sequelize.ENUM('web', 'ios', 'android', 'all'),
        allowNull: false,
        defaultValue: 'all'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      special_plan: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      more_details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscriptions')
  }
}
