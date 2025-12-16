'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addIndex('transaction_bankings', ['created_at'], {
                name: 'transaction_bankings_created_at_index'
            })
            await queryInterface.addIndex('transaction_bankings', ['is_first_deposit'], {
                name: 'transaction_bankings_is_first_deposit_index'
            })

            await queryInterface.addIndex('transaction_bankings', ['transaction_type'], {
                name: 'transaction_bankings_transaction_type_index'
            })

            await queryInterface.addIndex('transaction_bankings', ['status'], {
                name: 'transaction_bankings_status_index'
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_at_index')
        await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_is_first_deposit_index')
        await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_transaction_type_index')
        await queryInterface.removeIndex('transaction_bankings', 'transaction_bankings_status_index')
    }
}
