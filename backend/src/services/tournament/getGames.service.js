import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetGamesTournamentService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel
      },
      sequelize
    } = this.context

    const { limit, pageNo, providerId, search, gameSubCategoryId, gameIds, tournamentId, excludeTournamentGames, orderBy } = this.args
    try {
      let tournament
      let tournamentGameIds = []
      const conditions = []
      if (gameIds && gameIds !== 'all') conditions.push('master_casino_game_id IN (:gameIds)')
      if (search) conditions.push('game_name ILIKE :search')
      if (providerId && providerId !== 'all') conditions.push('provider_id = :providerId')
      if (gameSubCategoryId && gameSubCategoryId !== 'all') conditions.push('sub_category_id = :gameSubCategoryId')
      if (tournamentId) {
        tournament = await TournamentModel.findOne({
          attributes: ['gameId'],
          where: { tournamentId: tournamentId },
          raw: true
        })
        if (tournament?.gameId) {
          if (orderBy === 'tournamentId') {
            tournamentGameIds = tournament.gameId
          } else if (excludeTournamentGames) {
            conditions.push('master_casino_game_id NOT IN (:tournamentGameIds)')
          } else {
            conditions.push('master_casino_game_id IN (:tournamentGameIds)')
          }
        }
      }
      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
      const { page, size } = pageValidation(pageNo, limit)
      const offset = (page - 1) * size

      const countQuery = `
        SELECT COUNT(DISTINCT master_casino_game_id) AS "totalCount"
        FROM game_data_view
        ${whereClause}`

      const dataQuery = `
      WITH ranked_games AS (
        SELECT 
          master_casino_game_id AS "masterCasinoGameId",
          game_name AS "name",
          provider_name AS "providerName",
          provider_id AS "masterCasinoProviderId",
          is_featured AS "isFeatured",
          sub_category_id AS "subCategoryId",
          sub_category_name AS "subCategoryName",
          ROW_NUMBER() OVER (PARTITION BY master_casino_game_id ORDER BY master_casino_game_id ASC) AS row_num
        FROM game_data_view
        ${whereClause}
      )
      SELECT 
        "masterCasinoGameId",
        "name",
        "providerName",
        "masterCasinoProviderId",
        "isFeatured",
        "subCategoryId",
        "subCategoryName"
      FROM ranked_games
      WHERE row_num = 1
      ORDER BY 
        ${tournamentGameIds.length > 0
          ? `CASE ${tournamentGameIds.map((id, index) => `WHEN "masterCasinoGameId" = ${id} THEN ${index + 1}`).join(' ')} ELSE ${tournamentGameIds.length + 1} END,`
          : '"masterCasinoGameId" DESC,'}
        "masterCasinoGameId"
      LIMIT :limit 
      OFFSET :offset`

      const replacements = {
        gameIds: gameIds && gameIds !== 'all' ? gameIds.split(',').map(Number) : null,
        tournamentGameIds: tournament?.gameId || null,
        search: search ? `%${search}%` : null,
        providerId: providerId && providerId !== 'all' ? +providerId : null,
        gameSubCategoryId: gameSubCategoryId && gameSubCategoryId !== 'all' ? [+gameSubCategoryId] : null,
        limit: size,
        offset
      }
      const [totalCountResult, gamesResult] = await Promise.all([
        sequelize.query(countQuery, { type: sequelize.QueryTypes.SELECT, replacements }),
        sequelize.query(dataQuery, { type: sequelize.QueryTypes.SELECT, replacements })
      ])

      const games = {
        count: totalCountResult[0]?.totalCount || 0,
        data: gamesResult
      }
      if (!games) return this.addError('GameNotFoundErrorType')

      return { games, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
