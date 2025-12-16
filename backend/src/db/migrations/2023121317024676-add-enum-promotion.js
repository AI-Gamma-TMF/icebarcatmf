'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.sequelize.query(
        'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'affiliate-bonus\';'
      ),
      queryInterface.sequelize.query(
        'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'affiliate-bonus\';'
      ),
      queryInterface.sequelize.query(
        'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'affiliate-bonus-claimed\';'
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
