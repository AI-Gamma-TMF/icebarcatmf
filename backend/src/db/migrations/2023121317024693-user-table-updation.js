'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'level', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.changeColumn('users', 'affiliate_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'level', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
    await queryInterface.changeColumn('users', 'affiliate_status', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })
  }
}
