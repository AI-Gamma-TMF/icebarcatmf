
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Transaction Bankings
    queryInterface.addIndex('transaction_bankings', ['updated_at', 'status', 'actionee_id'], {
      name: 'transaction_bankings_updated_status_actionee_id_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_type', 'transaction_type', 'status'], {
      name: 'transaction_bankings_actionee_type_transaction_type_status_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['updated_at', 'transaction_type', 'actionee_id'], {
      name: 'transaction_bankings_updated_transaction_type_actionee_id_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_type', 'transaction_type'], {
      name: 'transaction_bankings_actionee_type_transaction_type_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'status', 'transaction_type', 'actionee_type'], {
      name: 'transaction_bankings_actionee_id_status_transaction_type_actionee_type_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'is_success', 'transaction_type'], {
      name: 'transaction_bankings_actionee_id_is_success_transaction_type_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'transaction_type', 'is_success', 'created_at'], {
      name: 'actionee_id_transaction_bankings_transaction_type_is_success_created_at_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'transaction_type', 'status', 'updated_at'], {
      name: 'actionee_id_transaction_bankings_transaction_type_status_updated_at_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'transaction_type', 'status'], {
      name: 'actionee_id_transaction_bankings_transaction_type_status_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['updated_at', 'actionee_id'], {
      name: 'transaction_bankings_updated_at_actionee_id_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['is_first_deposit', 'actionee_type', 'transaction_type', 'actionee_id'], {
      name: 'transaction_bankings_is_first_deposit_actionee_type_transaction_type_actionee_id_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['updated_at', 'actionee_id', 'transaction_type', 'status'], {
      name: 'transaction_bankings_updated_at_actionee_id_transaction_type_status_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['actionee_id', 'transaction_type', 'status'], {
      name: 'transaction_bankings_actionee_id_transaction_type_status_idx'
    })
    queryInterface.addIndex('transaction_bankings', ['updated_at', 'transaction_type', 'actionee_id'], {
      name: 'actionee_id_transaction_bankings_updated_at_transaction_type_idx'
    })

    // Casino Transactions
    queryInterface.addIndex('casino_transactions', ['updated_at', 'user_id'], {
      name: 'casino_transactions_updated_at_user_id_idx'
    })
    queryInterface.addIndex('casino_transactions', ['action_type', 'amount_type'], {
      name: 'casino_transactions_action_type_amount_type_idx'
    })
    queryInterface.addIndex('casino_transactions', ['amount_type'], {
      name: 'casino_transactions_amount_type_idx'
    })
    queryInterface.addIndex('casino_transactions', ['user_id', 'action_type', 'amount_type'], {
      name: 'casino_transactions_user_id_action_type_amount_type_idx'
    })
    queryInterface.addIndex('casino_transactions', ['user_id', 'action_type', 'amount_type', 'created_at'], {
      name: 'user_id_casino_transactions_action_type_amount_type_created_at_idx'
    })
    queryInterface.addIndex('casino_transactions', ['user_id', 'action_type', 'created_at'], {
      name: 'user_id_action_type_created_at_idx'
    })

    // Users
    queryInterface.addIndex('users', ['created_at', 'is_internal_user'], {
      name: 'users_created_at_is_internal_user_idx'
    })
    queryInterface.addIndex('users', ['updated_at', 'is_internal_user'], {
      name: 'users_updated_at_is_internal_user_idx'
    })
    queryInterface.addIndex('users', ['created_at', 'is_internal_user', 'kyc_status'], {
      name: 'users_createdAt_is_internal_user_kyc_status_idx'
    })
    queryInterface.addIndex('users', ['sign_in_method'], {
      name: 'users_sign_in_method_idx'
    })
    queryInterface.addIndex('users', ['is_email_verified'], {
      name: 'users_is_email_verified_idx'
    })
    queryInterface.addIndex('users', ['kyc_status'], {
      name: 'users_kyc_status_idx'
    })

    // User Activities
    queryInterface.addIndex('user_activities', ['user_id'], {
      name: 'user_activities_user_id_idx'
    })
    queryInterface.addIndex('user_activities', ['user_id', 'activity_type', 'created_at'], {
      name: 'user_id_user_activities_activity_type_created_at_idx'
    })

    // User Documents
    queryInterface.addIndex('user_documents', ['updated_at', 'user_id', 'status'], {
      name: 'user_documents_updated_at_user_id_status_idx'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('user_documents', 'user_documents_updated_at_user_id_status_idx')

    await queryInterface.removeIndex('user_activities', 'user_activities_activity_type_created_at_idx')

    await queryInterface.removeIndex('user_activities', 'user_activities_user_id_idx')

    await queryInterface.removeIndex('users', 'users_kyc_status_idx')

    await queryInterface.removeIndex('users', 'users_is_email_verified_idx')

    await queryInterface.removeIndex('users', 'users_sign_in_method_idx')

    await queryInterface.removeIndex('users', 'users_createdAt_is_internal_user_kyc_status_idx')

    await queryInterface.removeIndex('users', 'users_updated_at_is_internal_user_idx')

    await queryInterface.removeIndex('users', 'users_created_at_is_internal_user_idx')

    await queryInterface.removeIndex('casino_transactions', 'casino_transactions')

    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_user_id_action_type_amount_type_idx')

    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_amount_type_idx')

    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_action_type_amount_type_idx')

    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_updated_at_user_id_idx')

    await queryInterface.removeIndex('casino_transactions', 'user_id_action_type_created_at_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_updated_at_transaction_type_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_id_transaction_type_status_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_updated_at_actionee_id_transaction_type_status_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_is_first_deposit_actionee_type_transaction_type_actionee_id_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_updated_at_actionee_id_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_transaction_type_status_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_transaction_type_status_updated_at_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_transaction_type_is_success_created_at_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_id_is_success_transaction_type_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_id_status_transaction_type_actionee_type_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_type_transaction_type_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_updated_transaction_type_actionee_id_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_actionee_type_transaction_type_status_idx')

    await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_updated_status_actionee_id_idx')
  }
}
