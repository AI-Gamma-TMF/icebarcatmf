'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ providerId }]] = await queryInterface.sequelize.query(
      `SELECT master_casino_provider_id as "providerId" from public.master_casino_providers WHERE name = '${'BETERLIVE'}'`
    )
    await queryInterface.bulkInsert('master_casino_games', [
      {
        name: 'The Kickoff',
        master_casino_provider_id: providerId,
        identifier: 'launch_rom_sport_kickoff_1',
        return_to_player: 95.83,
        is_active: false,
        is_demo_supported: true,
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
