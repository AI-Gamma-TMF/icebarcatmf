'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'tier-bonus-claimed\''
        ),

        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'monthly-tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'monthly-tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'monthly-tier-bonus-claimed\''
        ),

        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'weekly-tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'weekly-tier-bonus\''
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'weekly-tier-bonus-claimed\''
        )
      ])
    } catch (error) {
      console.log('Error occurred in migration file', error)
      return error
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
}
