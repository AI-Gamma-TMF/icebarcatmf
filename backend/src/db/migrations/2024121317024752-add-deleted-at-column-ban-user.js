'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const safeAddColumn = async (table, column, options) => {
      try {
        await queryInterface.addColumn(table, column, options)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`Column ${column} already exists in table ${table}, skipping.`)
        } else {
          throw error
        }
      }
    }

    await safeAddColumn('ban_user_setting', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('ban_user_setting', 'deleted_at')
  }
}
