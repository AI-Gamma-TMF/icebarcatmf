'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'public',
        tableName: 'tiers'
      },
      {
        tier_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        required_xp: {
          type: Sequelize.BIGINT,
          allowNull: false,
          comment: '1 XP = 1 SC & 1 XP = 10,000 GC coins'
        },
        bonus_gc: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        bonus_sc: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        weekly_bonus_percentage: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        monthly_bonus_percentage: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        is_active:{
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        level: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        icon: {
          type: Sequelize.STRING,
          allowNull: true
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
    await queryInterface.dropTable('tiers', { schema: 'public' })
  }
}
