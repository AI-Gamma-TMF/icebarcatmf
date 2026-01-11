'use strict'

const views = require('../views/index')
const functions = require('../functions/index')
const { default: config } = require('../../configs/app.config')

const s3Prefix = config.get('s3.S3_DOMAIN_KEY_PREFIX')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
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
        // Replace the slug column reference with NULL
        viewSql = viewSql.replace(
          /"masterGameSubCategory"\.slug AS sub_category_slug,/g,
          'NULL::varchar AS sub_category_slug,'
        )
      }

      // Create views
      await queryInterface.sequelize.query(viewSql, { replacements: { s3Prefix } })

      await Promise.all([
        // Create Function
        queryInterface.sequelize.query(functions.gameDataFunction),
        // Create Index
        queryInterface.sequelize.query('CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS game_data_view_unique_index ON game_data_view(game_data_id);')
      ])

      // Triggers
      await Promise.all([
        queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY game_data_view;'), // Refresh view
        queryInterface.sequelize.query('CREATE TRIGGER refresh_view_on_mga AFTER INSERT OR UPDATE OR DELETE ON master_game_aggregators FOR EACH STATEMENT EXECUTE FUNCTION refresh_game_data_view();'),
        queryInterface.sequelize.query('CREATE TRIGGER refresh_view_on_mcp AFTER INSERT OR UPDATE OR DELETE ON master_casino_providers FOR EACH STATEMENT EXECUTE FUNCTION refresh_game_data_view();'),
        queryInterface.sequelize.query('CREATE TRIGGER refresh_view_on_mgsc AFTER INSERT OR UPDATE OR DELETE ON master_game_sub_categories FOR EACH STATEMENT EXECUTE FUNCTION refresh_game_data_view();'),
        queryInterface.sequelize.query('CREATE TRIGGER refresh_view_on_gsc AFTER INSERT OR UPDATE OR DELETE ON game_subcategory FOR EACH STATEMENT EXECUTE FUNCTION refresh_game_data_view();'),
        queryInterface.sequelize.query('CREATE TRIGGER refresh_view_on_mcg AFTER UPDATE OR DELETE ON master_casino_games FOR EACH STATEMENT EXECUTE FUNCTION refresh_game_data_view();')
      ])
    } catch (error) {
      throw Error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Drop Indexes
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS game_data_view_unique_index;')
    // Drop Function
    await queryInterface.sequelize.query('DROP CASCADE FUNCTION IF EXISTS refresh_game_data_view()') // Delete's all the triggers as well.
    // Drop Views
    await queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS game_data_view;')
  }
}
