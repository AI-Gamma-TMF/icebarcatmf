'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.allSettled([
      queryInterface.addColumn('amoe', 'registered_date', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.addColumn('amoe', 'remark', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('amoe', 'registered_date')
    queryInterface.removeColumn('amoe', 'remark')
  }
}
