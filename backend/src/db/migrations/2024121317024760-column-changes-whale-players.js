'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    console.log('------------', process.env.NODE_ENV)
    
    // Check if pg_partman extension is available
    let hasPartman = false
    try {
      const [result] = await queryInterface.sequelize.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_available_extensions WHERE name = 'pg_partman'
        ) as available;
      `)
      hasPartman = result[0]?.available === true
    } catch (e) {
      console.log('Could not check for pg_partman availability:', e.message)
    }

    // Use partitioned table only if pg_partman is available and not in dev/staging
    const usePartitioning = hasPartman && !['development', 'staging'].includes(process.env.NODE_ENV)
    
    if (usePartitioning) {
      try {
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
      } catch (e) {
        console.log('Partitioned table creation failed, falling back to simple table:', e.message)
        // Fall back to simple table if partitioning fails
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

          CREATE INDEX IF NOT EXISTS whale_players_user_id_idx ON whale_players (user_id);
          CREATE INDEX IF NOT EXISTS whale_players_timestamp_idx ON whale_players (timestamp);
        `)
      }
    } else {
      // Simple table without partitioning for dev/staging or when pg_partman is not available
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

        CREATE INDEX IF NOT EXISTS whale_players_user_id_idx ON whale_players (user_id);
        CREATE INDEX IF NOT EXISTS whale_players_timestamp_idx ON whale_players (timestamp);
      `)
    }
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS whale_players')
  }
}
