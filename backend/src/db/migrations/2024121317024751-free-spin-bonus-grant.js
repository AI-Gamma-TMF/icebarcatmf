'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('free_spin_bonus_grant', {
      free_spin_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      master_casino_game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      free_spin_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      free_spin_round: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      coin_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_notify_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      free_spin_type: {
        type: Sequelize.STRING,
        defaultValue: 'directGrant',
        comment: 'directGrant, dailyBonus, packages'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      more_details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    },
    { schema: 'public' })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('free_spin_bonus_grant', { schema: 'public' })
  }
}
