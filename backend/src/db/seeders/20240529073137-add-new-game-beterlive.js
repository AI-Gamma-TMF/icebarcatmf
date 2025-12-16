'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ providerId }]] = await queryInterface.sequelize.query(
      `SELECT master_casino_provider_id as "providerId" from public.master_casino_providers WHERE name = '${'BETERLIVE'}'`
    )
    console.log(providerId)
    await queryInterface.bulkInsert('master_casino_games', [
      {
        name: 'Grand Bonus Baccarat',
        master_casino_provider_id: providerId,
        identifier: 'launch_rom_main_gbb_1',
        return_to_player: 98.76,
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
