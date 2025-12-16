'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('anti_fraud_rules', {
      anti_fraud_rule_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      rule_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      activity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'redemptions:1, login:2, registered-data:3, purchase:4, wins:5'
      },
      country_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: {
            tableName: 'countries',
            schema: 'public'
          },
          key: 'country_id'
        }
      },
      group_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: {
            tableName: 'player_groups',
            schema: 'public'
          },
          key: 'group_id'
        }
      },
      single_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      sum_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      with_same_ip: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      with_same_device: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_duplicate: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_same_address: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_email: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      is_alert: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      is_restrict: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('anti_fraud_rules')
  }
}
