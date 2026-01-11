'use strict'
const views = require('../views')
const { default: config } = require('../../configs/app.config')
const s3Prefix = config.get('s3.S3_DOMAIN_KEY_PREFIX')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use queryInterface.sequelize for transaction to avoid connection pool exhaustion
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS game_data_view;', { transaction })
      await queryInterface.sequelize.query(views.gameDataView, { replacements: { s3Prefix }, transaction })
      await transaction.commit()
      await queryInterface.sequelize.query('CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS game_data_view_unique_index ON game_data_view(game_data_id);')
      await queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY game_data_view;')
    } catch (error) {
      await transaction.rollback()
      throw Error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {}
}
