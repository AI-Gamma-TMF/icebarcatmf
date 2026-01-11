'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use raw SQL to update game images from thumbnails
    // THUMBNAIL_TYPE.LONG = 1
    // This migration is safe to skip if the tables don't exist (fresh database)
    try {
      // Check if both tables exist before attempting the update
      const [tables] = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('master_casino_games', 'master_casino_games_thumbnails')
      `)
      
      // Only run if both tables exist
      if (tables.length === 2) {
        await queryInterface.sequelize.query(`
          UPDATE master_casino_games mcg
          SET image_url = mcgt.thumbnail
          FROM master_casino_games_thumbnails mcgt
          WHERE mcg.master_casino_game_id = mcgt.master_casino_game_id
            AND mcgt.thumbnail_type = 1
        `)
      } else {
        console.log('Skipping migration: required tables do not exist yet')
      }
    } catch (error) {
      console.log('Migration skipped due to error:', error.message)
      // Don't throw - this migration is optional data migration
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
