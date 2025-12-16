'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query("UPDATE tournament SET status = '2'", { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log('Error while running update tournament seeder', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
