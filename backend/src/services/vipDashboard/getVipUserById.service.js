import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE, USER_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { isUserOnline, prepareImageUrl } from '../../utils/common'
const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
}

const constraints = ajv.compile(schema)
export class GetVipUserByIdService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserInternalRating: UserInternalRatingModel,
        UserTier: UserTierModel,
        ResponsibleGambling: ResponsibleGamblingModel,
        WhalePlayers: WhalePlayersModel,
        UserGameStats: UserGameStatsModel,
        AdminUser: AdminUserModel
      },
      sequelize
    } = this.context

    const { userId } = this.args
    try {
      const [whalesData, user] = await Promise.all([
        WhalePlayersModel.findOne({
          attributes: ['vipQuestionnaireBonusAmount'],
          where: { userId, vipQuestionnaireBonusAmount: { [Op.gt]: 0 } },
          raw: true
        }),
        UserModel.findOne({
          where: { userId },
          attributes: [
            'userId',
            'email',
            'firstName',
            'isActive',
            'lastName',
            'username',
            'createdAt',
            'kycStatus',
            'lastLoginDate',
            'isBan',
            'isRestrict',
            'isInternalUser',
            'reasonId',
            'addressLine_1',
            'addressLine_2',
            'dateOfBirth',
            'phone',
            'selfExclusion',
            'loggedIn',
            'uniqueId',
            'profileImage'
          ],
          include: [
            {
              model: UserInternalRatingModel,
              attributes: ['rating', 'score', 'vipStatus', 'moreDetails', 'managedBy', 'vipRevokedDate', 'vipApprovedDate', 'managedByAssignmentDate'],
              required: true,
              include: [
                {
                  model: AdminUserModel,
                  attributes: ['firstName', 'lastName'],
                  required: false,
                  raw: true
                }]
            },
            {
              model: UserGameStatsModel,
              attributes: ['top5provider', 'top10GamesByBetCount', 'top10Wins'],
              required: false
            },
            {
              model: UserTierModel,
              attributes: [
                'level',
                [
                  sequelize.literal(`
                  (SELECT name
                   FROM tiers
                   WHERE "tiers"."tier_id" = "UserTier"."tier_id")
                `),
                  'tierName'
                ]
              ]
            },
            {
              model: ResponsibleGamblingModel,
              as: 'responsibleGambling',
              attributes: ['timeBreakDuration', 'status'],
              required: false,
              where: { responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE }
            }
          ],
          group: [
            'userId',
            'UserGameStat.user_game_stats_id',
            'UserInternalRating.user_internal_rating_id',
            'UserTier.user_tier_id',
            'responsibleGambling.responsible_gambling_id', // Use alias here!
            'UserInternalRating->AdminUser.admin_user_id'
          ]
        })
      ])
      const currentlyOnline = await isUserOnline(user.uniqueId)
      const vipBonusAmount = whalesData?.vipQuestionnaireBonusAmount || 0

      let status = USER_STATUS.Active
      if (!user.isActive) {
        status = USER_STATUS.isActive
      } else if (user.isBan) {
        status = USER_STATUS.isBan
      } else if (user.isRestrict) {
        status = USER_STATUS.isRestrict
      } else if (user.isInternalUser) {
        status = USER_STATUS.isInternalUser
      }
      user.dataValues.currentlyOnline = currentlyOnline
      user.dataValues.status = status
      user.dataValues.accountManagerBy = user?.UserInternalRating?.AdminUser ? `${user?.UserInternalRating?.AdminUser?.firstName} ${user?.UserInternalRating?.AdminUser?.lastName}` : null
      user.dataValues.profileImage = user?.profileImage ? prepareImageUrl(user?.profileImage) : null
      user.dataValues.vipQuestionnaireBonusAmount = vipBonusAmount
      user.dataValues.isVipQuestionnaireBonus = vipBonusAmount > 0
      const top10Wins = user?.UserGameStat?.top10Wins || []
      const top10GamesByBetCount = user?.UserGameStat?.top10GamesByBetCount || []
      const top5provider = user?.UserGameStat?.top5provider || []
      const mostPlayedGameId = top10GamesByBetCount[0]?.gameId || null
      const mostPlayedProviderId = top5provider[0]?.providerId || null
      let mostPlayedGameName = null
      let mostPlayedProviderName = null
      if (mostPlayedGameId || mostPlayedProviderId) {
        const rows = await sequelize.query(
    `
    (
    SELECT 
      g.master_casino_game_id,
      NULL AS provider_id,
      g.name AS "gameName",
      NULL AS "providerName"
    FROM master_casino_games g
    WHERE g.master_casino_game_id = :gameId
    LIMIT 1
  )
  UNION
  (
    SELECT 
      NULL AS master_casino_game_id,
      p.master_casino_provider_id AS provider_id,
      NULL AS "gameName",
      p.name AS "providerName"
    FROM master_casino_providers p
    WHERE p.master_casino_provider_id = :providerId
    LIMIT 1
  )
    `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        gameId: mostPlayedGameId,
        providerId: mostPlayedProviderId
      }
    }
        )

        for (const row of rows) {
          if (row?.master_casino_game_id === mostPlayedGameId && mostPlayedGameName === null) {
            mostPlayedGameName = row?.gameName
          }

          if (row?.provider_id === mostPlayedProviderId && mostPlayedProviderName === null) {
            mostPlayedProviderName = row?.providerName
          }
        }
      }

      user.dataValues.UserReport = {
        biggestWin: top10Wins[0]?.maxWin || 0,
        mostPlayedGameName: mostPlayedGameName,
        mostPlayedProviderName: mostPlayedProviderName
      }

      delete user.dataValues.UserGameStat
      delete user?.UserInternalRating?.AdminUser
      return user ? { user, message: SUCCESS_MSG.GET_SUCCESS } : this.addError('UserNotExistsErrorType')
    } catch (error) {
      console.log('error', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
