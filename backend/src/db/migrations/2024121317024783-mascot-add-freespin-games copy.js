'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    try {
      await queryInterface.sequelize.query(`
        UPDATE master_casino_games
        SET has_freespins = true
        WHERE master_casino_provider_id = (
          SELECT master_casino_provider_id
          FROM master_casino_providers
          WHERE name = 'MASCOT'
        )
        AND REPLACE(identifier, 'MASCOT-', '') IN (
          'anksunamun_tqoe', 're_kill', 'northern_heat', 'cancan_saloon', 'lions_pride', 'the_rite', 'the_tomb_det',
          'mermaids_bay', 'venetian_magic', 'bamboo_bear', 'hellsing', 'legioner', 'fruit_vegas', 'gryphons_castle',
          'wild_spirit', 'merlins_tower', 'purple_pills', 'robin_of_loxley', 'gemz_grow', 'bennys_the_biggest_game',
          'red_horde', 'riot', 'fruit_macau', 'fruit_monaco', 'queen_of_spades', '3_corsairs', 'prince_of_persia_tgop',
          'bastet_and_cats', 'the_myth', 'book_of_amaterasu', 'zeus_the_thunderer', 'amaterasu_keno', 'merry_scary_christmas',
          'fruits_of_luxor', 'dragons_nest', 'pinup_dolls', 'the_evil_bet', 'aloha_tiki_bar', 'primal_bet_rockways',
          'fairytale_coven', 'cleopatras_gems_rockways', 'for_the_realm', 'across_the_universe', 'mayan_riches_rockways',
          'riot_2_bnb', 'princess_and_dwarfs_rockways', 'deepsea_riches', 'hydras_lair', 'la_fiesta_de_muertos',
          'greedy_greenskins_rockways', 'fruit_machine_x25', 'easter_luck', 'rocket_chimp_jackpot', 'aloha_tiki_bar_dice',
          'dice_of_luxor', 'dice_vegas', 'fruits_of_mbit', 'hook_up_fishing_wars', 'wild_phoenix_rises', 'the_pendragon_legend',
          'minotaurs_wilds', 'zeus_the_thunderer_deluxe', 'hello_win', 'book_of_anksunamun_rockways', 'christmas_infinite_gifts',
          'wild_wild_bet', 're_kill_ultimate', 'dragons_lucky_25', 'dreamshock_jackpot_x', 'the_candy_slot_deluxe', 'mist',
          'fabulous_farm_slot', 'ice_number_one', 'sticky_fruit_madness', 'reel_eldorado', 'wood_luck', 'riot_ultimate',
          'incredible_xfu_hero', 'fruit_vegas_extreme_x125', 'cancan_saloon_deluxe', 'booming_fruity_boom',
          'bastet_and_cats_deluxe', '243_fruity_zen', 'catch_the_win', 'riot_brutalskis_revenge', 'lucky_year_25',
          'the_biggest_win_x50', 'zeus_the_invincible', 'for_the_realm_deluxe', 'tessa_hunt_and_the_eye_of_horus',
          'wasteland_riches', 'fruity_x125', 'anksunamun_deluxe', 'friar_tucks_inn', 'lucky_fruity_coin'
        );

        UPDATE master_casino_providers
        SET free_spin_allowed = true
        WHERE name = 'MASCOT';

        UPDATE master_game_aggregators
        SET free_spin_allowed = true
        where name = 'mascot';

        UPDATE master_casino_games
        SET free_spin_bet_scale_amount = '1'::jsonb
        WHERE master_casino_provider_id = (
          SELECT master_casino_provider_id
          FROM master_casino_providers
          WHERE name = 'MASCOT'
        );
      `)
    } catch (error) {
      console.log(error)
      console.log('------------------PLEASE RERUN THIS AFTER DEPLOYMENT IS COMPLETE------------------------')
    }
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('')
  }
}
