'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.sequelize.query(
        "ALTER TYPE \"public\".\"enum_user_activities_activity_type\" ADD VALUE 'promocode-applied';"
      )
    ])
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
