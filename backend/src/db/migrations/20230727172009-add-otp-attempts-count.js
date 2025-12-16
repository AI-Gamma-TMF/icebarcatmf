'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'new_otp_requested',
    {
      type: Sequelize.DATE,
      allowNull: true
    }
    )
    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'otp_attempts',
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
    }, 'otp_attempts', Sequelize.INTEGER)
    await queryInterface.removeColumn({
      tableName: 'users',
      schema: 'public'
    }, 'new_otp_requested', Sequelize.DATE)
  }
}
