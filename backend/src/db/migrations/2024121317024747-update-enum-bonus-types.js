'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'vip-questionnaire-bonus\''),
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'vip-questionnaire-bonus\''),
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'vip-questionnaire-bonus-claimed\''),
        queryInterface.addColumn('questionnaire', 'order_id', {
          type: Sequelize.INTEGER,
          allowNull: true
        })
      ])
    } catch (error) {
      console.log('Error occurred in migration file', error)
      return error
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
}
