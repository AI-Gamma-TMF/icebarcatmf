'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.addIndex('users', ['created_at'], {
                name: 'user_created_at_index'
            })
            await queryInterface.addIndex('users', ['otp_verified_date'], {
                name: 'user_otp_verified_date_index'
            })

        } catch (error) {
            console.log(error)
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('users', 'user_created_at_index')
        await queryInterface.removeIndex('users', 'user_otp_verified_date_index')
    }
}
