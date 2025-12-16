import sequelize, { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { getAll, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { DOCUMENTS, RESPONSIBLE_GAMBLING_TYPE, STATUS, STATUS_VALUE, TICKET_STATUS, TICKET_TYPE, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'
import { getUserTierDetails } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'string' },
    userType: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserByIdService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId } = this.args
    if (!+userId) {
      return this.addError('InvalidIdErrorType')
    }
    const query = { userId }

    try {
      const user = await getOne({
        model: db.User,
        data: query,
        attributes: {
          exclude: ['password']
        },
        include: [
          { model: db.Wallet, as: 'userWallet' },
          {
            model: db.UserReports,
            as: 'UserReport',
            attributes: ['totalPurchaseAmount', 'totalPendingRedemptionAmount', 'totalRedemptionAmount', [sequelize.literal('ROUND(COALESCE((total_sc_bet_amount / NULLIF(total_purchase_amount, 0)), 0) :: numeric, 2)'), 'playThrough']]
          },
          {
            model: db.ResponsibleGambling,
            as: 'responsibleGambling',
            where: {
              status: '1'
            },
            required: false
          },
          {
            model: db.UserActivities,
            as: 'userActivity',
            attributes: ['ipAddress'],
            where: {
              activityType: {
                [Op.in]: [
                  USER_ACTIVITIES_TYPE.LOGIN,
                  USER_ACTIVITIES_TYPE.LOGOUT
                ]
              }
            },
            order: [['userActivityId', 'DESC']],
            limit: 1
          },
          { model: db.BanUserSetting, as: 'banReason', attributes: ['reasonId', 'reasonTitle', 'reasonDescription', 'reasonCount'], required: false },
          {
            model: db.BlockedUsers,
            as: 'blockedUsers',
            attributes: ['isAvailPromocodeBlocked'],
            required: false
          }
        ]
      })

      if (!user) {
        return this.addError('UserNotExistErrorType')
      }

      if (!user.dataValues.isEmailVerified) {
        user.dataValues.activationLink =
          config.get().userFrontendUrl +
          '/user/verifyEmail?token=' +
          user.dataValues.emailToken
      }

      const userPendingVerificationTickets = await db.UserTickets.count({
        col: 'id',
        where: {
          playerId: userId,
          ticketType: TICKET_TYPE.VERIFICATION,
          status: TICKET_STATUS.PENDING
        }
      })

      const userPendingRedemptionTickets = await db.UserTickets.count({
        col: 'id',
        where: {
          playerId: userId,
          ticketType: TICKET_TYPE.REDEMPTION,
          status: TICKET_STATUS.PENDING
        }
      })

      const userPendingExpiryTickets = await db.UserTickets.count({
        col: 'id',
        where: {
          playerId: userId,
          ticketType: TICKET_TYPE.EXPIRY,
          status: TICKET_STATUS.PENDING
        }
      })

      const userPendingFraudTickets = await db.UserTickets.count({
        col: 'id',
        where: {
          playerId: userId,
          ticketType: TICKET_TYPE.FRAUD,
          status: TICKET_STATUS.PENDING
        }
      })
      user.dataValues.userPendingVerificationTickets =
        userPendingVerificationTickets
      user.dataValues.userPendingRedemptionTickets =
        userPendingRedemptionTickets
      user.dataValues.userPendingFraudTickets = userPendingFraudTickets
      user.dataValues.userPendingExpiryTickets = userPendingExpiryTickets

      const userDocs = await getAll({
        model: db.UserDocument,
        data: {
          documentName: {
            [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID, DOCUMENTS.BANK_CHECKING]
          },
          userId
        },
        order: [['documentName', 'ASC']],
        attributes: ['documentUrl', 'documentName', 'status'],
        raw: true
      })

      user.dataValues.profileStatus = STATUS_VALUE.PENDING
      user.dataValues.bankStatus = STATUS_VALUE.PENDING

      if (userDocs?.length) {
        if (userDocs[0]?.documentName === DOCUMENTS.ADDRESS) {
          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
        } else if (userDocs[0]?.documentName === DOCUMENTS.ID) {
          user.dataValues.idProof = userDocs[0].documentUrl.slice(-1)[0]
        } else if (
          userDocs[0]?.documentName === DOCUMENTS.BANK_CHECKING &&
          userDocs[0].status === STATUS.APPROVED
        ) {
          user.dataValues.bankStatus = STATUS_VALUE.APPROVED
        }
      }

      if (userDocs?.length && userDocs?.length === 3) {
        if (userDocs[0].status === STATUS.APPROVED && userDocs[2].status === STATUS.APPROVED) user.dataValues.profileStatus = STATUS_VALUE.APPROVED
        else if (userDocs[0].status === STATUS.REJECTED || userDocs[2].status === STATUS.REJECTED) user.dataValues.profileStatus = STATUS_VALUE.REJECTED
        else user.dataValues.profileStatus = STATUS_VALUE.REQUESTED

        user.dataValues.idProof = userDocs[2].documentUrl.slice(-1)[0]

        if (userDocs[1].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
        else if (userDocs[1].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED
        else user.dataValues.bankStatus = STATUS_VALUE.REQUESTED
      } else if (userDocs?.length && userDocs?.length === 2) {
        if (
          userDocs[0].documentName === DOCUMENTS.ADDRESS &&
          userDocs[1].documentName === DOCUMENTS.ID
        ) {
          if (userDocs[0].status === STATUS.APPROVED && userDocs[1].status === STATUS.APPROVED) user.dataValues.profileStatus = STATUS_VALUE.APPROVED
          else if (userDocs[0].status === STATUS.REJECTED || userDocs[1].status === STATUS.REJECTED) user.dataValues.profileStatus = STATUS_VALUE.REJECTED
          else user.dataValues.profileStatus = STATUS_VALUE.REQUESTED

          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
          user.dataValues.idProof = userDocs[1].documentUrl.slice(-1)[0]
        }
        if (
          userDocs[0].documentName === DOCUMENTS.ADDRESS &&
          userDocs[1].documentName === DOCUMENTS.BANK_CHECKING
        ) {
          if (userDocs[1].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
          else if (userDocs[1].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED

          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
        }
        if (
          userDocs[0].documentName === DOCUMENTS.BANK_CHECKING &&
          userDocs[1].documentName === DOCUMENTS.ID
        ) {
          if (userDocs[0].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
          else if (userDocs[0].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED

          user.dataValues.idProof = userDocs[1].documentUrl.slice(-1)[0]
        }
      }

      if (user.responsibleGambling.length !== 0) {
        for (const rg of user.responsibleGambling) {
          if (
            rg.responsibleGamblingType ===
            RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION &&
            rg.selfExclusion
          ) {
            user.dataValues.RG = 'self exclusion'
            break
          } else if (
            rg.responsibleGamblingType ===
            RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK &&
            new Date(rg.timeBreakDuration) > new Date()
          ) {
            user.dataValues.RG = 'Take a break'
            break
          } else user.dataValues.RG = 'NO'
          // else if (rg.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME) {
          //   user.dataValues.RG = 'Limit'
          //   break
          // }
        }
      } else user.dataValues.RG = 'NO'

      delete user.dataValues.responsibleGambling
      delete user.dataValues.emailToken
      user.dataValues.is2FAEnable = !!user.mfaType

      // add user-tier details:
      user.dataValues.tierDetails = await getUserTierDetails(userId)

      return { user, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
