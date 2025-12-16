'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.allSettled([
      queryInterface.addIndex('users_tiers', ['user_id'], { name: 'users_tiers_user_id_index' }),
      queryInterface.addIndex('users', ['email'], { name: 'users_email_index' }),
      queryInterface.addIndex('users', ['deleted_at', 'email'], { name: 'idx_users_delete_at_email' }),
      queryInterface.addIndex('wallets', ['owner_id'], { name: 'wallets_owner_id_index' }),
      queryInterface.addIndex('users_tiers', ['user_id', 'tier_id'], { name: 'idx_user_tiers_user_id_tier_id' }),
      queryInterface.addIndex('tiers', ['tier_id', 'is_active'], { name: 'idx_tiers_tier_id_is_active' }),
      queryInterface.addIndex('transaction_bankings', ['transaction_id'], { name: 'idx_transaction_banking_transaction_id' })
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.allSettled([
      queryInterface.removeIndex('users_tiers', 'users_tiers_user_id_index'),
      queryInterface.removeIndex('users', 'users_email_index'),
      queryInterface.removeIndex('users', 'idx_users_delete_at_email'),
      queryInterface.removeIndex('wallets', 'wallet_owner_id_index'),
      queryInterface.removeIndex('users_tiers', 'idx_user_tiers_user_id_tier_id'),
      queryInterface.removeIndex('tiers', 'idx_tiers_tier_id_is_active'),
      queryInterface.removeIndex('transaction_bankings', 'idx_transaction_banking_transaction_id')
    ])
  }
}
