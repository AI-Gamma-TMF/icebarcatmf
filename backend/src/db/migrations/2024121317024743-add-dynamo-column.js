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

    await safeAddColumn('users', 'is_user_dynamo_linked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })

    await safeAddColumn('users', 'd10x_link_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    })

    await safeAddColumn('users', 'dynamo_last_synced_at', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await safeAddIndex('users', ['d10x_link_id'], {
      name: 'users_d10x_link_id_idx',
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'users_d10x_link_id_idx')
    await queryInterface.removeColumn('users', 'd10x_link_id')
    await queryInterface.removeColumn('users', 'is_user_dynamo_linked')
    await queryInterface.removeColumn('users', 'dynamo_last_synced_at')
  }
}
