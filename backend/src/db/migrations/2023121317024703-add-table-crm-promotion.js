'use strict'

const { CRM_PROMOTION_TYPE } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'public',
        tableName: 'crm_promotions'
      },
      {
        crm_promotion_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        promocode: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        campaign_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        user_ids: {
          type: Sequelize.ARRAY(Sequelize.BIGINT),
          allowNull: false,
          defaultValue: []
        },
        claim_bonus: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        promotion_type: {
          type: Sequelize.ENUM(Object.values(CRM_PROMOTION_TYPE)),
          allowNull: false
        },
        sc_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0.00
        },
        gc_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0.00
        },
        crm_promocode: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        expire_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE
        }
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('crm_promotions', { schema: 'public' })
  }
}
