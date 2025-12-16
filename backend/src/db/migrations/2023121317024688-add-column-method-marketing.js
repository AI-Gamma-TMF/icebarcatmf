'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'email_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'sms_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'email_marketing')
    await queryInterface.removeColumn('users', 'sms_marketing')
  }
}
