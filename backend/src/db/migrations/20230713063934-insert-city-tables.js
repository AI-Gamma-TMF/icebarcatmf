'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('city', {
      city_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'state',
            schema: 'public'
          },
          key: 'state_id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.dropTable('city', { schema: 'public' })
    } catch (error) {
      console.log(error)
    }
  }
}
