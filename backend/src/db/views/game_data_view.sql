CREATE MATERIALIZED VIEW game_data_view AS
WITH tournament_active_games AS (
   SELECT DISTINCT gameInTournament AS game_id
   FROM public.tournament
   CROSS JOIN LATERAL UNNEST(tournament.game_id) AS gameInTournament
   WHERE tournament.status = '1' )
SELECT
    ROW_NUMBER() OVER () AS game_data_id,
    "masterGameSubCategory".master_game_sub_category_id AS sub_category_id,
    "masterGameSubCategory".name->>'EN' AS sub_category_name,
    "masterGameSubCategory".order_id AS sub_category_order_id,
    "masterGameSubCategory".slug AS sub_category_slug,
    "masterGameSubCategory".is_featured,
        json_build_object('thumbnail',
        CASE
            WHEN ("masterGameSubCategory".image_url ->> 'thumbnail'::text) IS NULL THEN NULL::text
            WHEN ("masterGameSubCategory".image_url ->> 'thumbnail'::text) IS NOT NULL AND ("masterGameSubCategory".image_url ->> 'thumbnail'::text) !~ 'https://'::text THEN concat(:s3Prefix, "masterGameSubCategory".image_url ->> 'thumbnail'::text)
            ELSE "masterGameSubCategory".image_url ->> 'thumbnail'::text
        END, 'selectedThumbnail',
        CASE
            WHEN ("masterGameSubCategory".image_url ->> 'selectedThumbnail'::text) IS NULL THEN NULL::text
            WHEN ("masterGameSubCategory".image_url ->> 'selectedThumbnail'::text) IS NOT NULL AND ("masterGameSubCategory".image_url ->> 'selectedThumbnail'::text) !~ 'https://'::text THEN concat(:s3Prefix, "masterGameSubCategory".image_url ->> 'selectedThumbnail'::text)
            ELSE "masterGameSubCategory".image_url ->> 'selectedThumbnail'::text
        END) AS sub_category_thumbnails,
    master_game_aggregators.master_game_aggregator_id AS aggregator_id,
	  master_game_aggregators.name AS aggregator_name,
    master_casino_providers.master_casino_provider_id AS provider_id,
    master_casino_providers.name AS provider_name,
    master_casino_providers.order_id AS provider_order_id,
	 CASE
       WHEN master_casino_providers.thumbnail_url IS NULL THEN NULL::character varying
            WHEN master_casino_providers.thumbnail_url IS NOT NULL AND master_casino_providers.thumbnail_url::text !~ 'https://'::text THEN concat(:s3Prefix, master_casino_providers.thumbnail_url)::character varying
            ELSE master_casino_providers.thumbnail_url
        END AS provider_thumbnail_url,
    "masterCasinoGames".master_casino_game_id,
    "masterCasinoGames".name AS game_name,
    "gameSubCategory".order_id AS game_order_id,
     CASE
            WHEN "masterCasinoGames".image_url IS NULL THEN NULL::character varying
            WHEN "masterCasinoGames".image_url IS NOT NULL AND "masterCasinoGames".image_url::text !~ 'https://'::text THEN concat(:s3Prefix, "masterCasinoGames".image_url)::character varying
            ELSE "masterCasinoGames".image_url
        END AS game_image_url,
    "masterCasinoGames".identifier AS game_identifier,
	CASE WHEN "masterCasinoGames".has_freespins IS NULL THEN true ELSE "masterCasinoGames".has_freespins END AS free_spins_allowed,
    "masterCasinoGames".more_details AS master_casino_game_more_details,
    CASE
      WHEN "gamesActiveInTournament".game_id IS NOT NULL THEN true
      ELSE false
    END  AS game_in_tournament
  FROM
    public.master_casino_games AS "masterCasinoGames"
    LEFT JOIN public.game_subcategory AS "gameSubCategory" ON "masterCasinoGames".master_casino_game_id = "gameSubCategory".master_casino_game_id
    LEFT JOIN public.master_game_sub_categories AS "masterGameSubCategory" ON "masterGameSubCategory".master_game_sub_category_id = "gameSubCategory".master_game_sub_category_id AND "masterGameSubCategory".is_active = true
    LEFT JOIN public.master_casino_providers ON master_casino_providers.master_casino_provider_id = "masterCasinoGames".master_casino_provider_id
	  LEFT JOIN public.master_game_aggregators ON master_casino_providers.master_game_aggregator_id = master_game_aggregators.master_game_aggregator_id
    LEFT JOIN tournament_active_games AS "gamesActiveInTournament" ON "masterCasinoGames".master_casino_game_id::int = "gamesActiveInTournament".game_id::int
  WHERE
    "masterCasinoGames".is_active = true
    AND "masterCasinoGames".master_casino_provider_id IN ( SELECT master_casino_provider_id FROM public.master_casino_providers WHERE is_active = true AND master_game_aggregator_id IN ( SELECT master_game_aggregator_id FROM public.master_game_aggregators WHERE is_active = true ))
  ORDER BY
    "masterGameSubCategory".order_id, "gameSubCategory".order_id;