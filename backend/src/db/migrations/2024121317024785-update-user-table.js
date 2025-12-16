'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'otp', 'mfa_type')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'mfa_type', 'otp')
  }
}
