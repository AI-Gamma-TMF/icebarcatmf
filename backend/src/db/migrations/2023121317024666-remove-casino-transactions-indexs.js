'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove indexes on the specified columns
    await queryInterface.removeIndex('casino_transactions', 'user_id_casino_transactions_action_type_amount_type_created_at_') // Replace 'index_name' with the actual name of the index to remove
    await queryInterface.removeIndex('casino_transactions', 'user_id_action_type_created_at_idx')
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_updated_at_user_id_idx')
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_amount_type_idx')
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_action_type_amount_type_idx')
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_status_index')
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the removed indexes
    await queryInterface.addIndex('casino_transactions', ['user_id', 'action_type', 'amount_type', 'created_at'], {
      name: 'user_id_casino_transactions_action_type_amount_type_created_at_', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })

    await queryInterface.addIndex('casino_transactions', ['column1', 'column2'], {
      name: 'index_name', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })

    await queryInterface.addIndex('casino_transactions', ['updated_at', 'user_id'], {
      name: 'casino_transactions_updated_at_user_id_idx', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })

    await queryInterface.addIndex('casino_transactions', ['amount_type'], {
      name: 'casino_transactions_amount_type_idx', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })

    await queryInterface.addIndex('casino_transactions', ['action_type', 'amount_type'], {
      name: 'casino_transactions_action_type_amount_type_idx', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })

    await queryInterface.addIndex('casino_transactions', ['status'], {
      name: 'casino_transactions_status_index', // Replace 'index_name' with the desired name for the index
      unique: false // Specify if the index is unique or not
    })
  }
}
