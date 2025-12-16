'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("UPDATE users SET mfa_type = 'google_auth' WHERE auth_enable = true")
  },

  down: async (queryInterface, Sequelize) => {
  }
}
