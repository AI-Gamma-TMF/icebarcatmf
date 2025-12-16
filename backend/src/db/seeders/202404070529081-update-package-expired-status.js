'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const currentTimestamp = new Date() // Current timestamp

      // Update the expired Packages
      await queryInterface.bulkUpdate(
        'package',
        {
          is_active: false,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          is_active: true,
          valid_till: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.ne]: null },
              { [Sequelize.Op.lt]: currentTimestamp }
            ]
          }
        },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: Add logic to undo the update if needed
  }
}
