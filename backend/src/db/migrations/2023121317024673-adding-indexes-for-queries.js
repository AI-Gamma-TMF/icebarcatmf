'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.addIndex('casino_transactions', ['round_id'], { name: 'casino_transaction_round_id_index' }),
        queryInterface.addIndex('casino_transactions', ['created_at'], { name: 'casino_transaction_created_at_index' }),
        queryInterface.addIndex('casino_transactions', ['action_type'], { name: 'casino_transaction_action_type_index' }),
        queryInterface.addIndex('withdraw_requests', ['user_id'], { name: 'withdraw_requests_user_id_index' }),
        queryInterface.addIndex('master_casino_games', ['is_active'], { name: 'master_casino_games_is_active_index' }),
        queryInterface.addIndex('master_game_sub_categories', ['is_active'], { name: 'master_game_sub_categories_is_active_index' })
      ])
    } catch (error) {
      console.log('Error while adding indexes')
    }
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeIndex('casino_transactions', 'casino_transaction_round_id_index'),
      queryInterface.removeIndex('casino_transactions', 'casino_transaction_created_at_index'),
      queryInterface.removeIndex('casino_transactions', 'casino_transaction_action_type_index'),
      queryInterface.removeIndex('withdraw_requests', 'withdraw_requests_user_id_index'),
      queryInterface.removeIndex('master_casino_games', 'master_casino_games_is_active_index'),
      queryInterface.removeIndex('master_game_sub_categories', 'master_game_sub_categories_is_active_index')
    ])
  }
}
