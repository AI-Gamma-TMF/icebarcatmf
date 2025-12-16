'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'ssn_update_count', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('users', 'ssn_update_count')
  }
};
