'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add index to cms_pages
      await queryInterface.addIndex('cms_pages', ['category', 'is_active'], {
        name: 'cms_pages_category_is_active_index'
      })

      // Add index to master_casino_games
      await queryInterface.addIndex('master_casino_games', ['is_active', 'master_casino_game_id', 'master_casino_provider_id'], {
        name: 'master_casino_games_is_active_master_casino_game_id_master_casino_provider_id_index'
      })
      await queryInterface.addIndex('master_casino_games', ['is_active', 'master_casino_game_id'], {
        name: 'master_casino_games_is_active_master_casino_game_id_index'
      })

      // Add index to master_game_categories
      await queryInterface.addIndex('master_game_categories', ['is_active', 'master_game_category_id'], {
        name: 'master_game_categories_is_active_master_game_category_id_index'
      })
      await queryInterface.addIndex('master_game_categories', ['is_active'], {
        name: 'master_game_categories_is_active_index'
      })

      // Add index to user_bonus
      await queryInterface.addIndex('user_bonus', ['status', 'user_id', 'bonus_type', 'is_active'], {
        name: 'user_bonus_status_user_id_bonus_type_is_active_index'
      })

      // Add index to package
      await queryInterface.addIndex('package', ['is_active', 'is_visible_in_store'], {
        name: 'package_is_active_is_visible_in_store_index'
      })

      // Add index to game_subcategory
      await queryInterface.addIndex('game_subcategory', ['master_game_sub_category_id'], {
        name: 'game_subcategory_master_game_sub_category_id_index'
      })

      // Add index to wallets
      await queryInterface.addIndex('wallets', ['owner_id'], {
        name: 'wallets_owner_id_index'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index from cms_pages
    await queryInterface.removeIndex('cms_pages', 'cms_pages_category_is_active_index')

    // Remove index from master_casino_games
    await queryInterface.removeIndex('master_casino_games', 'master_casino_games_is_active_master_casino_game_id_master_casino_provider_id_index')
    await queryInterface.removeIndex('master_casino_games', 'master_casino_games_is_active_master_casino_game_id_index')

    // Remove index from master_game_categories
    await queryInterface.removeIndex('master_game_categories', 'master_game_categories_is_active_master_game_category_id_index')
    await queryInterface.removeIndex('master_game_categories', 'master_game_categories_is_active_index')

    // Remove index from package
    await queryInterface.removeIndex('package', 'package_is_active_is_visible_in_store_index')

    // Remove index from user_bonus
    await queryInterface.removeIndex('user_bonus', 'user_bonus_status_user_id_bonus_type_is_active_index')

    // Remove index from game_subcategory
    await queryInterface.removeIndex('game_subcategory', 'game_subcategory_master_game_sub_category_id_index')

    // Remove index from wallets
    await queryInterface.removeIndex('wallets', 'wallets_owner_id_index')
  }
}
