'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('state', {
      state_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      state_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'countries',
            schema: 'public'
          },
          key: 'country_id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      uniqueKeys: {
        Items_unique: {
          fields: ['state_code']
        }
      }
    }, { schema: 'public' })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('state', { schema: 'public' })
  }
}
