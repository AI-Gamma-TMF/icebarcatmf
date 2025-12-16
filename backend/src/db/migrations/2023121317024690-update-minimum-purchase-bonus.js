'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bonus', 'minimum_purchase_amount')
    await queryInterface.addColumn('bonus', 'minimum_purchase_amount', {
      type: Sequelize.DOUBLE(10, 2),
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bonus', 'minimum_purchase_amount')
    await queryInterface.addColumn('bonus', 'minimum_purchase_amount', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
  },
};