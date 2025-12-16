'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addIndex('wallets', ['created_at'], {
                name: 'wallets_created_at_index'
            })

        } catch (error) {
            console.log(error)
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('wallets', 'wallets_created_at_index')
    }
}
