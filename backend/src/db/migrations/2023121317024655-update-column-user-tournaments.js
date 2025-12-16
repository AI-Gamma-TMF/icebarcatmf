'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_tournament', 'is_active')
    await queryInterface.addColumn('user_tournament', 'is_completed', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_tournament', 'is_completed')
    await queryInterface.addColumn('user_tournament', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  }
};
