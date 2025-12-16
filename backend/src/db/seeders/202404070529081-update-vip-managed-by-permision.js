'use strict'
import { updateSuperAdminPermissions } from '../../utils/common'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await updateSuperAdminPermissions()
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
