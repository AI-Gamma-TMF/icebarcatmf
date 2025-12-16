'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    console.log('------------', process.env.NODE_ENV)
    if (!['development', 'staging'].includes(process.env.NODE_ENV)) {
      await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS whale_players;
      
        CREATE TABLE whale_players (
          user_id INTEGER NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          total_purchase_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          purchase_count INTEGER NOT NULL DEFAULT 0,
          total_redemption_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          redemption_count INTEGER NOT NULL DEFAULT 0,
          admin_bonus DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          site_bonus_deposit DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          site_bonus DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          total_pending_redemption_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          pending_redemption_count INTEGER NOT NULL DEFAULT 0,
          cancelled_redemption_count INTEGER NOT NULL DEFAULT 0,
          total_sc_bet_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          total_sc_win_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          PRIMARY KEY (timestamp, user_id)
        ) PARTITION BY RANGE (timestamp);

        CREATE INDEX IF NOT EXISTS whale_players_user_id_idx ON whale_players (user_id);
        CREATE INDEX IF NOT EXISTS whale_players_timestamp_idx ON whale_players (timestamp);
        
        CREATE EXTENSION IF NOT EXISTS pg_partman;
        
        SELECT partman.create_parent(
          p_parent_table := 'public.whale_players',
          p_control := 'timestamp',
          p_interval := '1 month',
          p_start_partition := '2024-01-01 00:00:00+00',
          p_premake := 4
        );
        
        UPDATE partman.part_config
        SET infinite_time_partitions = true
        WHERE parent_table = 'public.whale_players';
      `)
    } else {
      await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS whale_players;
        
        CREATE TABLE whale_players (
          user_id INTEGER NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          total_purchase_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          purchase_count INTEGER NOT NULL DEFAULT 0,
          total_redemption_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          redemption_count INTEGER NOT NULL DEFAULT 0,
          admin_bonus DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          site_bonus_deposit DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          site_bonus DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          total_pending_redemption_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          pending_redemption_count INTEGER NOT NULL DEFAULT 0,
          cancelled_redemption_count INTEGER NOT NULL DEFAULT 0,
          total_sc_bet_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          total_sc_win_amount DOUBLE PRECISION NOT NULL DEFAULT 0.00,
          PRIMARY KEY (timestamp, user_id)
        );

        CREATE INDEX whale_players_user_id_idx ON whale_players (user_id);
        CREATE INDEX whale_players_timestamp_idx ON whale_players (timestamp);
      `)
    }
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS whale_players')
  }
}
