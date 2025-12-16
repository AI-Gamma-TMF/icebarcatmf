'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('server_logs', {
      server_log_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      original_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      route: {
        type: Sequelize.STRING,
        allowNull: true
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      params: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      query: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      body_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      body: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      headers: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      referrer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('server_logs')
  }
}
