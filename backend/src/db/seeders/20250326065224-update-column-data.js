'use strict'
const { QueryTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const allAmoe = await queryInterface.sequelize.query(
      'SELECT amoe_id, more_details FROM public.amoe',
      { type: QueryTypes.SELECT }
    )

    await allAmoe.map(async amoe => {
      await queryInterface.sequelize.query(
        'UPDATE public.amoe SET entry_id = :entryId WHERE amoe_id = :amoeId;',
        {
          replacements: {
            entryId: amoe.more_details.entryId,
            amoeId: amoe.amoe_id
          }
        }
      )
    })
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
