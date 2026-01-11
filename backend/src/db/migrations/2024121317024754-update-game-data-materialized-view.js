'use strict'

const views = require('../views')
const { default: config } = require('../../configs/app.config')
const s3Prefix = config.get('s3.S3_DOMAIN_KEY_PREFIX')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the slug column exists in master_game_sub_categories
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'master_game_sub_categories'
      AND column_name = 'slug';
    `)
    const hasSlugColumn = columns.length > 0

    // If slug column doesn't exist, use a modified view SQL that doesn't reference it
    let viewSql = views.gameDataView
    if (!hasSlugColumn) {
      viewSql = viewSql.replace(
        /"masterGameSubCategory"\.slug AS sub_category_slug,/g,
        'NULL::varchar AS sub_category_slug,'
      )
    }

    // Use queryInterface.sequelize for transaction to avoid connection pool exhaustion
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS game_data_view;', { transaction })
      await queryInterface.sequelize.query(viewSql, { replacements: { s3Prefix }, transaction })
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
