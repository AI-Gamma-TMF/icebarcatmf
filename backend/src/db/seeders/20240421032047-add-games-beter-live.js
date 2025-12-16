'use strict'
import { v4 as UUIDV4 } from 'uuid'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert aggregator
    const [aggregator] = await queryInterface.bulkInsert(
      'master_game_aggregators',
      [
        {
          name: 'beterlive',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: ['master_game_aggregator_id'] }
    )

    // Insert provider
    const [provider] = await queryInterface.bulkInsert(
      'master_casino_providers',
      [
        {
          name: 'BETERLIVE',
          is_active: true,
          master_game_aggregator_id: aggregator.master_game_aggregator_id,
          uuid: UUIDV4(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: ['master_casino_provider_id'] }
    )

    // Create providerGames related to the provider
    const provider_id = provider.master_casino_provider_id
    const games = await queryInterface.bulkInsert('master_casino_games', [
      {
        name: 'Live Roulette',
        master_casino_provider_id: provider_id,
        identifier: 'launch_main_rol_01',
        return_to_player: 97.3,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Live French Roulette',
        master_casino_provider_id: provider_id,
        identifier: 'launch_main_rofl_01',
        return_to_player: 98.65,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gravity Blackjack',
        master_casino_provider_id: provider_id,
        identifier: 'launch_main_ssbj_01',
        return_to_player: 96.91,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Speed Blackjack',
        master_casino_provider_id: provider_id,
        identifier: 'launch_main_bjl_03',
        return_to_player: 96.91,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Live Baccarat 1',
        master_casino_provider_id: provider_id,
        identifier: 'launch_asia_mbal_01',
        return_to_player: 98.94,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Live Baccarat 1 NC',
        master_casino_provider_id: provider_id,
        identifier: 'launch_asia_ncmbal_01',
        return_to_player: 98.76,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bet on Teen Patti',
        master_casino_provider_id: provider_id,
        identifier: 'launch_in_botp_1',
        return_to_player: 97.5,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oasis Blackjack',
        master_casino_provider_id: provider_id,
        identifier: 'launch_oasis_bjl_01',
        return_to_player: 96.91,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sic Bo',
        master_casino_provider_id: provider_id,
        identifier: 'launch_asia_sb_1',
        return_to_player: 97.22,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gravity Sic Bo',
        master_casino_provider_id: provider_id,
        identifier: 'launch_gravity_sb',
        return_to_player: 97.34,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Virtual Top Card',
        master_casino_provider_id: provider_id,
        identifier: 'launch_rng_tc_1',
        return_to_player: 96.27,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Auto Roulette',
        master_casino_provider_id: provider_id,
        identifier: 'launch_auto_rol_01',
        return_to_player: 97.3,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gravity Auto Roulette',
        master_casino_provider_id: provider_id,
        identifier: 'launch_rom_auto_mrol_1',
        return_to_player: 97.4,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Take Deal or Risk Blackjack',
        master_casino_provider_id: provider_id,
        identifier: 'launch_rom_tdrssbj_1',
        return_to_player: 96.91,
        is_active: true,
        is_demo_supported: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    return games
  },

  down: async (queryInterface, Sequelize) => {
    // Delete aggregator, provider, and providerGames
    await queryInterface.bulkDelete('master_game_aggregators', null, {})
    await queryInterface.bulkDelete('master_casino_providers', null, {})
    await queryInterface.bulkDelete('master_casino_games', null, {})
  }
}
