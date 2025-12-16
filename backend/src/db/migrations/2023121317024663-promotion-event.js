'use strict'

const { PROMOTION_EVENT_STATUS } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promotion_codes', {
      promocode_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      promocode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      affiliate_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      bonus_gc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bonus_sc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      valid_till: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: PROMOTION_EVENT_STATUS.PROMO_CREATED
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      availed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('promotion_codes')
  }
}
