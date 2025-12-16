'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country_code', Sequelize.String)

    await queryInterface.removeColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country', Sequelize.String)

    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country_code',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country_code', Sequelize.INTEGER)

    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country_code',
    {
      type: Sequelize.String,
      allowNull: true
    }
    )

    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'country',
    {
      type: Sequelize.String,
      allowNull: true
    }
    )
  }
}
