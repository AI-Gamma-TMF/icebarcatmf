'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use raw SQL to update game images from thumbnails
    // THUMBNAIL_TYPE.LONG = 1
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // Update master_casino_games.image_url from master_casino_games_thumbnails where thumbnail_type = 1 (LONG)
      await queryInterface.sequelize.query(`
        UPDATE master_casino_games mcg
        SET image_url = mcgt.thumbnail
        FROM master_casino_games_thumbnails mcgt
        WHERE mcg.master_casino_game_id = mcgt.master_casino_game_id
          AND mcgt.thumbnail_type = 1
      `, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      throw error
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
