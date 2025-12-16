'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'reason_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.addColumn('users', 'is_clear_wallet', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'reason_id')
    await queryInterface.removeColumn('users', 'is_clear_wallet')
  }
}
