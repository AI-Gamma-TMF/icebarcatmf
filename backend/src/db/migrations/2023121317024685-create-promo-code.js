'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promo_codes', {
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
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      valid_till: {
        type: Sequelize.DATE,
        allowNull: true
      },
      max_users_availed: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      per_user_limit: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      is_discount_on_amount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      discount_percentage: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      package: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    await queryInterface.dropTable('promo_codes')
  }
}
