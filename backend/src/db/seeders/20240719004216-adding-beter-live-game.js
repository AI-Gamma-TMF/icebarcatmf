'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ providerId }]] = await queryInterface.sequelize.query(
      `SELECT master_casino_provider_id as "providerId" from public.master_casino_providers WHERE name = '${'BETERLIVE'}'`
    )
    await queryInterface.bulkInsert('master_casino_games', [
      {
        name: 'Gravity Roulette',
        master_casino_provider_id: providerId,
        identifier: 'launch_mrol_gravity',
        return_to_player: 97.40,
        is_active: false,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
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
