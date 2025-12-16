'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addIndex('casino_transactions', ['created_at'], {
                name: 'casino_transactions_created_at_index'
            })
            await queryInterface.addIndex('casino_transactions', ['action_type'], {
                name: 'casino_transactions_action_type_index'
            })

            await queryInterface.addIndex('casino_transactions', ['amount_type'], {
                name: 'casino_transactions_amount_type_index'
            })

            await queryInterface.addIndex('casino_transactions', ['status'], {
                name: 'casino_transactions_status_index'
            })

        } catch (error) {
            console.log(error)
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('casino_transactions', 'casino_transactions_created_at_index')
        await queryInterface.removeIndex('casino_transactions', 'casino_transactions_action_type_index')
        await queryInterface.removeIndex('casino_transactions', 'casino_transactions_amount_type_index')
        await queryInterface.removeIndex('casino_transactions', 'casino_transactions_status_index')
    }
}
