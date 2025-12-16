'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('page_banners', 'is_count_down', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn('page_banners', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('page_banners', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('page_banners', 'is_count_down');
    await queryInterface.removeColumn('page_banners', 'start_date');
    await queryInterface.removeColumn('page_banners', 'end_date');
  }
};
