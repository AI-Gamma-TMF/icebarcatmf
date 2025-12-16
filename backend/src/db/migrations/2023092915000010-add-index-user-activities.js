'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('user_activities', ['created_at'], {
        name: 'user_activities_created_at_index'
      })

    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('user_activities', 'user_activities_created_at_index')
  }
}
