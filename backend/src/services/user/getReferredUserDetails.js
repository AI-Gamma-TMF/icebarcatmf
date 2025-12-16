import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import {
  BONUS_STATUS,
  BONUS_TYPE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  USER_ACTIVITIES_TYPE
} from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limit: { type: 'string', pattern: '^[0-9]+$' },
    pageNo: { type: 'string', pattern: '^[0-9]+$' }
  },
  required: ['userId']
}

const constraints = ajv.compile(schema)

export class GetReferredUserDetailsService extends ServiceBase {
  get constraints () {
    return constraints()
  }

  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserActivities: UserActivitiesModel,
        TransactionBanking: TransactionBankingModel,
        UserBonus: UserBonusModel
      }
    } = this.context
    const { userId, pageNo, limit } = this.args

    try {
      const userExist = await UserModel.findOne({
        where: { userId },
        attributes: ['userId', 'isActive']
      })

      if (!userExist) return this.addError('UserNotExistsErrorType')

      const { page, size } = pageValidation(pageNo, limit)

      const referredUsers = await UserModel.findAndCountAll({
        where: { referredBy: userId },
        offset: (page - 1) * size,
        limit: size,
        attributes: ['userId', 'email', 'username', 'createdAt'],
        order: [['createdAt', 'DESC']]
      })

      const referralDetails = []

      if (!referredUsers) return { success: true, count: 0, referralAmount: {}, referralDetails }

      await Promise.all(
        referredUsers.rows.map(async user => {
          let data = {
            userId: user.userId,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            bonusStatus: BONUS_STATUS.PENDING,
            totalPurchaseAmount: 0,
            totalGcPurchase: 0,
            totalScPurchase: 0
          }
          const isBonusClaimed = await UserActivitiesModel.findOne({
            where: {
              referredUser: user.userId,
              activityType: USER_ACTIVITIES_TYPE.REFERRAL_BONUS_CLAIMED,
              userId
            }
          })

          if (isBonusClaimed) data.bonusStatus = BONUS_STATUS.CLAIMED

          const purchaseDetail = await TransactionBankingModel.findOne({
            where: {
              actioneeId: user.userId,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              status: TRANSACTION_STATUS.SUCCESS
            },
            attributes: [
              [
                sequelize.fn('SUM', sequelize.col('amount')),
                'totalPurchaseAmount'
              ],
              [
                sequelize.fn('SUM', sequelize.col('gc_coin')),
                'totalGcPurchase'
              ],
              [sequelize.fn('SUM', sequelize.col('sc_coin')), 'totalScPurchase']
            ],
            raw: true
          })

          if (purchaseDetail) {
            data.totalPurchaseAmount = purchaseDetail?.totalPurchaseAmount || 0
            data.totalGcPurchase = purchaseDetail?.totalGcPurchase || 0
            data.totalScPurchase = purchaseDetail?.totalScPurchase || 0
          }
          referralDetails.push(data)
        })
      )

      const referralAmountEarned = await UserBonusModel.findOne({
        where: {
          userId,
          status: BONUS_STATUS.CLAIMED,
          bonusType: BONUS_TYPE.REFERRAL_BONUS
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('gc_amount')), 'totalGcEarn'],
          [sequelize.fn('SUM', sequelize.col('sc_amount')), 'totalScEarn']
        ],
        raw: true
      })

      const referralAmount = {
        totalGcEarn: referralAmountEarned?.totalGcEarn || 0,
        totalScEarn: referralAmountEarned?.totalScEarn || 0
      }

      return {
        success: true,
        count: referredUsers?.count,
        referralAmount,
        referralDetails
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
