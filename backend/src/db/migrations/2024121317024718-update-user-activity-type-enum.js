'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'provider-bonus-received\'')
      ])
    } catch (error) {
      console.log('Error occurred in migration file', error)
      return error
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
}
