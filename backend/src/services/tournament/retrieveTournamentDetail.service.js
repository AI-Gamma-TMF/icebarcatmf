import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'
import { Op } from 'sequelize'

const s3Config = config.getProperties().s3
export class RetrieveTournamentDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserTier: UserTierModel,
        Tournament: TournamentModel
      },
      sequelize
    } = this.context

    const { tournamentId } = this.args
    try {
      const tournament = await TournamentModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { tournamentId }
      })
      if (!tournament) {
        return this.addError('TournamentNotExistErrorType')
      }
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
      // send the actual URL by prefix the env value
      tournament.dataValues.imageUrl = tournament.imageUrl !== null ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${tournament.imageUrl}` : tournament.imageUrl

      // Adding the vipTournament Title Key
      tournament.dataValues.vipTournamentTitle = tournament?.moreDetails?.vipTournamentTitle ? tournament?.moreDetails?.vipTournamentTitle : undefined

      return {
        data: tournament,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
