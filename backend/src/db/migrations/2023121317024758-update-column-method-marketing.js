'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'email_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    })

    await queryInterface.changeColumn('users', 'sms_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('users', 'email_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })

    await queryInterface.changeColumn('users', 'sms_marketing', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  }
}
