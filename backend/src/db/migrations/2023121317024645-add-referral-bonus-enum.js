'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.allSettled([
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'referral-bonus\';'
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'referral-bonus\';'
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'referral-bonus-claimed\';'
        )
      ])
    } catch (error) {
      return
    }
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
/**
 *
 */
