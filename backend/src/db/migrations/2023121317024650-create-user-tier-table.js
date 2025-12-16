'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'public',
        tableName: 'users_tiers'
      },
      {
        user_tier_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        tier_id: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        level: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        max_level: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        sc_spend: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0
        },
        gc_spend: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users_tiers', { schema: 'public' })
  }
}
