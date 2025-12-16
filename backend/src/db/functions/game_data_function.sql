 CREATE OR REPLACE FUNCTION refresh_game_data_view()
      RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY game_data_view;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;