module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create a composite index on actioneeId, updatedAt, status, and transactionType
    // await queryInterface.addIndex('transaction_bankings', {
    //   name: 'idx_transaction_bankings_actionee_updated_status_type',
    //   fields: ['actionee_id', 'updated_at', 'status', 'transaction_type'],
    // })

    // await queryInterface.addIndex('casino_transactions', {
    //   name: 'idx_casino_transactions_updated_user_action_status_amount',
    //   fields: ['updated_at', 'user_id', 'action_type', 'status', 'amount_type'],
    // })

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_transaction_bankings_actionee_updated_status_type
      ON transaction_bankings (actionee_id, updated_at, status, transaction_type);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_casino_transactions_updated_user_action_status_amount
      ON casino_transactions (updated_at, user_id, action_type, status, amount_type);
    `);


    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS transaction_bankings_actionee_type_transaction_type_status_idx;
      DROP INDEX IF EXISTS transaction_bankings_actionee_type_transaction_type_idx;
      DROP INDEX IF EXISTS transaction_bankings_updated_transaction_type_actionee_id_idx;
      DROP INDEX IF EXISTS actionee_id_transaction_bankings_transaction_type_status_idx;
    `);

    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS casino_transaction_session_id_index;
      DROP INDEX IF EXISTS idx_casino_transaction_action_type_amount_type;
    `);

  },

  down: async (queryInterface, Sequelize) => {
    // Remove the index
    await queryInterface.removeIndex('transaction_bankings', 'idx_transaction_bankings_actionee_updated_status_type');
    await queryInterface.removeIndex('casino_transactions', 'idx_casino_transactions_updated_user_action_status_amount');
  }
};
