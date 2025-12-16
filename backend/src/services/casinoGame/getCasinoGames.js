import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/models'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const s3Config = config.getProperties().s3

export class GetCasinoGamesService extends ServiceBase {
  async run () {
    const { name, masterCasinoGameId, masterGameSubCategoryId, flag, providerId, status, activeOnSite, operator, filterBy, value, orderBy, sort, limit, pageNo, type } = this.args

    if (flag === 'true') {
      const games = await sequelize.query(`
        SELECT
          mcg.master_casino_game_id AS "masterCasinoGameId",
          mcg.name AS "name",
          mcg.master_casino_provider_id AS "masterCasinoProviderId",
          mcg.is_active AS "isActive",
          mcg.return_to_player AS "returnToPlayer",
          mcg.has_freespins AS "freeSpinAllowed",
          mcg.admin_enabled_freespin As "adminEnabledFreespin",
          gs.order_id AS "orderId",
          gs.game_subcategory_id AS "gameSubcategoryId",
          mcp.name AS "providerName",
          (CASE WHEN gdv.master_casino_game_id IS NOT NULL THEN true ELSE false END) AS "gameActiveOnSite"
        FROM
          master_casino_games mcg
        INNER JOIN game_subcategory gs ON mcg.master_casino_game_id = gs.master_casino_game_id
        INNER JOIN master_casino_providers mcp ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
        LEFT JOIN (SELECT DISTINCT ON (master_casino_game_id) * FROM game_data_view) gdv ON mcg.master_casino_game_id = gdv.master_casino_game_id
        ${masterGameSubCategoryId ? `WHERE gs.master_game_sub_category_id = ${+masterGameSubCategoryId}` : ''}
        ORDER BY gs.order_id ASC NULLS LAST;
        `,
      {
        type: QueryTypes.SELECT
      })

      return {
        success: SUCCESS_MSG.GET_SUCCESS,
        data: { count: +games.length, rows: games }
      }
    }

    let paginationQuery = ''
    if (pageNo && limit) {
      const { page, size } = pageValidation(pageNo, limit)
      paginationQuery = `LIMIT ${size} OFFSET ${(page - 1) * size}`
    }

    let filterWhereClause = ''
    let orderByClause = ''

    // Filter by clause
    switch (filterBy) {
      case 'returnToPlayer':
        filterWhereClause = `AND mcg.return_to_player ${operator} ${value}`
        break
      default:
        break
    }

    // Order by clause
    switch (orderBy) {
      case 'masterCasinoGameId':
        orderByClause = 'mcg.master_casino_game_id'
        break
      case 'gameName':
        orderByClause = 'mcg.name'
        break
      case 'isActive':
        orderByClause = 'mcg.is_active'
        break
      case 'masterCasinoProviderId':
        orderByClause = 'mcg.master_casino_provider_id'
        break
      case 'providerName':
        orderByClause = 'mcp.name'
        break
      case 'returnToPlayer':
        orderByClause = 'mcg.return_to_player'
        break
      case 'gameActiveOnSite':
        orderByClause = '(CASE WHEN gdv.master_casino_game_id IS NOT NULL THEN true ELSE false END)'
        break
      default:
        orderByClause = 'mcg.created_at'
        break
    }

    let searchName
    if (name) {
      searchName = name.replace(/'/g, "''")
    }

    const [count, gamesData] = await Promise.all([sequelize.query(`
      SELECT
        COUNT(*) AS "totalCount"
      FROM
        master_casino_games mcg
      LEFT JOIN (SELECT DISTINCT ON (master_casino_game_id) * FROM game_data_view) gdv ON mcg.master_casino_game_id = gdv.master_casino_game_id
      LEFT JOIN master_casino_providers mcp ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
      WHERE
        1 = 1
        ${name ? `AND mcg.name ILIKE '%${searchName}%'` : ''}
        ${masterCasinoGameId ? `AND mcg.master_casino_game_id = ${masterCasinoGameId}` : ''}
        ${providerId ? `AND mcg.master_casino_provider_id = ${providerId}` : ''}
        ${status ? `AND mcg.is_active = ${status}` : ''}
        ${activeOnSite ? `AND gdv.master_casino_game_id IS ${activeOnSite === 'true' ? 'NOT' : ''} NULL` : ''}
        ${masterGameSubCategoryId ? `AND mcg.master_casino_game_id ${type === 'NOT' ? 'NOT IN' : 'IN'} (SELECT master_casino_game_id FROM game_subcategory WHERE master_game_sub_category_id = ${masterGameSubCategoryId})` : ''}
        ${filterWhereClause}
        AND mcg.is_hidden = false
      `,
    {
      type: QueryTypes.SELECT
    }),
    sequelize.query(`
      SELECT
        mcg.master_casino_game_id AS "masterCasinoGameId",
        mcg.name AS "gameName",
        CASE WHEN mcg.image_url IS NOT NULL THEN '${s3Config.S3_DOMAIN_KEY_PREFIX}' || mcg.image_url ELSE NULL END AS "imageUrl",
        mcg.is_active AS "isActive",
         mcg.has_freespins AS "freeSpinAllowed",
        mcg.admin_enabled_freespin As "adminEnabledFreespin",
        mcg.master_casino_provider_id AS "masterCasinoProviderId",
        mcp.name AS "providerName",  
        mcg.return_to_player AS "returnToPlayer",
        (CASE WHEN gdv.master_casino_game_id IS NOT NULL THEN true ELSE false END) AS "gameActiveOnSite",
        (SELECT ARRAY_AGG(DISTINCT(master_game_sub_category_id)) FROM game_subcategory WHERE game_subcategory.master_casino_game_id = mcg.master_casino_game_id) AS "masterGameSubCategoryIds",
        mcg.created_at AS "createdAt"
      FROM
        master_casino_games mcg
      LEFT JOIN (SELECT DISTINCT ON (master_casino_game_id) * FROM game_data_view) gdv ON mcg.master_casino_game_id = gdv.master_casino_game_id
      LEFT JOIN master_casino_providers mcp ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
      WHERE
        1 = 1
        ${name ? `AND mcg.name ILIKE '%${searchName}%'` : ''}
        ${masterCasinoGameId ? `AND mcg.master_casino_game_id = ${masterCasinoGameId}` : ''}
        ${providerId ? `AND mcg.master_casino_provider_id = ${providerId}` : ''}
        ${status ? `AND mcg.is_active = ${status}` : ''}
        ${activeOnSite ? `AND gdv.master_casino_game_id IS ${activeOnSite === 'true' ? 'NOT' : ''} NULL` : ''}
        ${masterGameSubCategoryId ? `AND mcg.master_casino_game_id ${type === 'NOT' ? 'NOT IN' : 'IN'} (SELECT master_casino_game_id FROM game_subcategory WHERE master_game_sub_category_id = ${masterGameSubCategoryId})` : ''}
        ${filterWhereClause}
        AND mcg.is_hidden = false
      ORDER BY
        ${orderByClause || 'mcg.created_at'} ${sort || 'DESC'} NULLS LAST
      ${paginationQuery}
      `,
    {
      type: QueryTypes.SELECT
    })
    ])

    return {
      success: SUCCESS_MSG.GET_SUCCESS,
      data: { count: +count[0].totalCount, rows: gamesData }
    }
  }
}
