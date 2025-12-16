import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'
import { exportCenterAxiosCall, pageValidation } from '../../utils/common'
import { CSV_TYPE } from '../../utils/constants/constant'
import { Op } from 'sequelize'
const s3Config = config.getProperties().s3
export class GetTournamentDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel,
        UserTier: UserTierModel,
        ExportCenter: ExportCenterModel
      },
      sequelize
    } = this.context

    const { tournamentId, pageNo, limit, csvDownload, timezone, search } = this.args
    try {
      const tournament = await TournamentModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { tournamentId }
      })
      if (!tournament) {
        return this.addError('TournamentNotExistErrorType')
      }
      const { page, size } = pageValidation(pageNo, limit)
      tournament.dataValues.isEditable = true
      if (tournament.gameId) {
        tournament.dataValues.games = await sequelize.query(`
          WITH RankedGames AS (
            SELECT 
                master_casino_game_id AS "masterCasinoGameId",
                game_name AS "name",
                provider_name AS "providerName",
                provider_id AS "masterCasinoProviderId",
                is_featured AS "isFeatured",
                sub_category_id AS "subCategoryId",
                sub_category_name AS "subCategoryName",
                ROW_NUMBER() OVER (PARTITION BY master_casino_game_id ORDER BY master_casino_game_id) AS row_num
            FROM game_data_view
            WHERE master_casino_game_id IN (:gameId)
          )
            SELECT 
                "masterCasinoGameId", "name", "providerName", "masterCasinoProviderId",
                "isFeatured", "subCategoryId", "subCategoryName"
            FROM RankedGames
            WHERE row_num = 1 `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { gameId: tournament.gameId }
        })
        delete tournament.dataValues.gameId
      }
      if (tournament.allowedUsers && tournament.allowedUsers.length > 0) {
        const allowedUsersArray = await UserModel.findAll({
          attributes: ['userId', 'email', 'username', 'UserTier.level', [
            sequelize.literal(`
              (SELECT name
               FROM tiers
               WHERE "tiers"."tier_id" = "UserTier"."tier_id")
            `),
            'tierName'
          ]],
          include: [
            {
              model: UserTierModel,
              attributes: []
            }
          ],
          where: {
            userId: { [Op.in]: tournament?.allowedUsers }
          },
          raw: true
        })
        delete tournament.dataValues.allowedUsers
        tournament.dataValues.allowedUsers = allowedUsersArray
      }
      let userWhere = {}
      if (search) {
        if (/^\d+$/.test(search)) {
          userWhere = { userId: +search }
        } else {
          userWhere = {
            [Op.or]: [
              { username: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } }
            ]
          }
        }
      }
      // send the actual URL by prefix the env value
      tournament.dataValues.imageUrl = tournament.imageUrl !== null ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${tournament.imageUrl}` : tournament.imageUrl

      // Adding the vipTournament Title Key
      tournament.dataValues.vipTournamentTitle = tournament?.moreDetails?.vipTournamentTitle ? tournament?.moreDetails?.vipTournamentTitle : undefined

      const tournamentLeaderBoard = await UserTournamentModel.findAndCountAll({
        attributes: ['tournamentId', 'userId', 'score', 'isCompleted', 'playerBet', 'playerWin', 'ggr', 'scWinAmount', 'gcWinAmount', 'isWinner', 'createdAt', 'isBooted',
          [sequelize.literal(`
            CASE 
                WHEN rank IS NULL THEN RANK() OVER (ORDER BY score DESC) 
                ELSE rank 
            END
        `),
          'rank']],
        where: {
          tournamentId: tournament.tournamentId
        },
        include: [
          {
            model: UserModel,
            where: userWhere,
            attributes: ['userId', 'username', 'email']
          }
        ],
        order: [[sequelize.col('rank'), 'ASC'], ['score', 'DESC']],
        limit: size,
        offset: (page - 1) * size
      })
      let exportId, exportType
      if (csvDownload === true) {
        const transaction = await sequelize.transaction()
        try {
          const id = this.context.req.body.id
          const exportTable = await ExportCenterModel.create(
            {
              type: CSV_TYPE.TOURNAMENT_CSV,
              adminUserId: id,
              payload: this.args
            },
            { transaction }
          )
          exportId = exportTable.dataValues.id
          exportType = exportTable.dataValues.type

          const axiosBody = {
            tournamentId: tournamentId,
            csvDownload: csvDownload,
            exportId: exportId,
            exportType: exportType,
            type: exportType,
            timezone: timezone,
            search
          }
          await exportCenterAxiosCall(axiosBody)
          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      return {
        data: { tournament, tournamentLeaderBoard },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
