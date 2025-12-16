'use strict'
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createSchema('public')
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropSchema('public')
  }
}
