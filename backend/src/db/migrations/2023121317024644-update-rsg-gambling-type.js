'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query("ALTER TYPE \"public\".\"enum_responsible_gambling_responsible_gambling_type\" ADD VALUE '3';")
    } catch (error) { 
      return
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
