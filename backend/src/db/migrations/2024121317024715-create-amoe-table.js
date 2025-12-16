'use strict'

const { AMOE_BONUS_STATUS } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amoe', {
      amoe_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: AMOE_BONUS_STATUS.PENDING
      },
      scanned_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      more_details: {
        type: Sequelize.JSONB,
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('amoe')
  }
}
