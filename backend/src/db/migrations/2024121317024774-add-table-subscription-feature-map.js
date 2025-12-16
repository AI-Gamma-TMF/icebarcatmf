'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscription_feature_map', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subscriptions',
          key: 'subscription_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subscription_feature_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subscription_features',
          key: 'subscription_feature_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    // add a unique constraint to prevent duplicates
    await queryInterface.addConstraint('subscription_feature_map', {
      fields: ['subscription_id', 'subscription_feature_id'],
      type: 'unique',
      name: 'unique_subscription_plan_feature'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscription_feature_map')
  }
}
