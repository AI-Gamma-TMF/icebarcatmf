'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.allSettled([
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'wheel-spin-bonus\';'
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'wheel-spin-bonus\';'
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'wheel-spin-bonus\';'
        )
      ])
    } catch (error) {
      console.log('Error occur in migration file', error)
      return error
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
