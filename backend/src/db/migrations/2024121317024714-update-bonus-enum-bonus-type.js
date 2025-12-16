'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Promise.all([
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_user_bonus_bonus_type" ADD VALUE \'provider-bonus\''),
        queryInterface.sequelize.query('ALTER TYPE "public"."enum_bonus_bonus_type" ADD VALUE \'provider-bonus\'')
      ])
    } catch (error) {
      console.log('Error occurred in migration file', error)
      return error
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
}
