import { sequelize } from '../../../db/models'
import ServiceBase from '../../../libs/serviceBase'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetGameLobbyDetailsService extends ServiceBase {
  async run () {
    const {
      subCategoryId,
      providerId,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      startDate,
      endDate
    } = this.args

    let { search } = this.args

    if (search && (search.includes('%') || search.includes('_'))) search = search.replace(/[%_]/g, '\\$&')

    const subCategories = await sequelize.query(`
      WITH TotalGames AS (
      SELECT
        sub_category_id AS "subCategoryId",
        COUNT(*) AS total_count
      FROM game_data_view
      WHERE
        sub_category_id IS NOT NULL
        ${search ? 'AND game_name iLIKE :search' : ''} 
        ${+providerId > 0 ? 'AND provider_id = :providerId' : ''} 
        ${+subCategoryId > 0 ? 'AND sub_category_id = :subCategoryId' : ''} 
      GROUP BY sub_category_id
      ),
      RankedGames AS (
        SELECT
          sub_category_id AS "subCategoryId",
          sub_category_name AS "subCategoryName",
          sub_category_thumbnails AS "subCategoryThumbnails",
          sub_category_order_id AS "subCategoryOrderId",
          game_data_view.master_casino_game_id AS "gameId",
          game_name AS "gameName",
          game_order_id AS "gameOrderId",
          game_image_url AS "gameImage",
          provider_id AS "providerId",
          provider_name AS "providerName",
          is_featured AS "isFeatured",
          gmd.discount_percentage AS "discountPercentage",
          ROW_NUMBER() OVER (PARTITION BY sub_category_id ORDER BY game_order_id ASC) AS row_number
        FROM game_data_view
        LEFT JOIN game_monthly_discount gmd
          ON game_data_view.master_casino_game_id = gmd.master_casino_game_id
          AND gmd.start_month_date = :startDate 
          AND gmd.end_month_date = :endDate
        WHERE
          sub_category_id IS NOT NULL
          ${search ? 'AND game_name iLIKE :search' : ''} 
          ${+providerId > 0 ? 'AND provider_id = :providerId' : ''} 
          ${+subCategoryId > 0 ? 'AND sub_category_id = :subCategoryId' : ''}
      )
      SELECT
        rg."subCategoryId" AS "masterGameSubCategoryId",
        rg."subCategoryName" AS "name",
        rg."subCategoryThumbnails" :: TEXT AS "imageUrl",
        rg."subCategoryOrderId" AS "orderId",
        rg."isFeatured" AS "isFeatured",
        json_agg(
          json_build_object(
            'masterCasinoGameId', rg."gameId",
            'name', rg."gameName",
            'imageUrl', rg."gameImage",
            'discountPercentage', rg."discountPercentage")
          ORDER BY rg."gameOrderId"
        ) AS "subCategoryGames",
        tg.total_count AS "totalGames",
        (CASE WHEN tg.total_count > :offset + :limit THEN true ELSE false END) AS "isMoreGame"
      FROM RankedGames rg
      JOIN TotalGames tg ON rg."subCategoryId" = tg."subCategoryId"
      WHERE
        rg."subCategoryId" IS NOT NULL
        ${search ? 'AND rg."gameName" iLIKE :search' : ''} 
        ${+providerId > 0 ? 'AND rg."providerId" = :providerId' : ''} 
        ${+subCategoryId > 0 ? 'AND rg."subCategoryId" = :subCategoryId' : ''}
        AND rg.row_number BETWEEN :offset + 1 AND :offset + :limit
      GROUP BY
        rg."subCategoryId",
        rg."subCategoryName",
        rg."subCategoryOrderId",
        rg."subCategoryThumbnails" :: TEXT,
        rg."isFeatured",
        tg.total_count
      ORDER BY
        rg."subCategoryOrderId" ASC;
    `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        limit: +limit,
        offset: (page - 1) * limit,
        startDate,
        endDate,
        ...(search ? { search: `%${search}%` } : {}),
        ...(+subCategoryId > 0 ? { subCategoryId } : {}),
        ...(+providerId > 0 ? { providerId } : {})
      }
    }
    )

    await Promise.all(
      subCategories.map(subCategory => {
        subCategory.imageUrl = JSON.parse(subCategory?.imageUrl)
        return true
      })
    )

    return {
      success: true,
      data: subCategories,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
