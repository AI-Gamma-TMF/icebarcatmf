'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('user_tournament', 'total_win'),
      queryInterface.addColumn('user_tournament', 'score', {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('user_tournament', 'sc_win_amount', {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('user_tournament', 'gc_win_amount', {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      }),
    ])
   
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('user_tournament', 'gc_win_amount'),
      queryInterface.removeColumn('user_tournament', 'sc_win_amount'),
      queryInterface.removeColumn('user_tournament', 'score'),
      queryInterface.addColumn('user_tournament', 'total_win', {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      }),
    ])

  }
};
