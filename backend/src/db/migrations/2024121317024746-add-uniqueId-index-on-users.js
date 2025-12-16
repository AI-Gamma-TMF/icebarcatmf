'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const safeAddIndex = async (table, fields, options) => {
      try {
        await queryInterface.addIndex(table, fields, options)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`Index ${options.name} already exists on table ${table}, skipping.`)
        } else {
          throw error
        }
      }
    }

    await safeAddIndex('users', ['unique_id'], {
      name: 'users_unique_id_idx',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'users_unique_id_idx')
  }
}
