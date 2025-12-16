'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bonus', 'btn_text', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.sequelize.query('ALTER TABLE bonus ALTER COLUMN "image_url" TYPE VARCHAR;');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE bonus ALTER COLUMN "image_url" TYPE ???;'); 

    await queryInterface.removeColumn('bonus', 'btn_text');
  }
};