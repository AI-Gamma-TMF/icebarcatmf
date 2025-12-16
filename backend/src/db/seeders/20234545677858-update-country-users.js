'use strict'
import db from '../../db/models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.User.update(
      { countryCode: 199 },
      { where: { kycStatus: ['K3', 'K4'] } }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
