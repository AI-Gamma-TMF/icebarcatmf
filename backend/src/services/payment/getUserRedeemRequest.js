import { minus, round } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    transactionId: { type: 'string' }
  },
  required: ['userId', 'transactionId']
}

const constraints = ajv.compile(schema)

export class GetUserRedeemRequestService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, transactionId } = this.args
    let redeemDetail = {}

    try {
      const {
        dbModels: {
          User: UserModel,
          WithdrawRequest: WithdrawRequestModel,
          UserTier: UserTierModel,
          Tier: TierModel,
          UserReports: UserReportsModel
        }
      } = this.context

      let isUserEnabled = true

      const transactionDetail = await WithdrawRequestModel.findOne({
        where: {
          userId,
          transactionId
        }
      })

      if (!transactionDetail) { return this.addError('WithdrawRequestNotFoundErrorType') }

      const userReport = await UserReportsModel.findOne({
        where: { userId: +transactionDetail.userId },
        raw: true
      })

      // Fetch user profile and tier details
      const userDetail = await UserModel.findOne({
        where: {
          userId: +transactionDetail.userId
        },
        attributes: [
          'state',
          'zipCode',
          'isActive',
          'isBan',
          'isRestrict',
          'isInternalUser',
          'disabledAt'
        ],
        include: [
          {
            model: UserTierModel,
            attributes: ['level'],
            include: {
              model: TierModel,
              attributes: ['name', 'level']
            }
          }
        ]
      })

      if (
        !userDetail.isActive ||
        userDetail.isBan ||
        userDetail.isRestrict ||
        userDetail.isInternalUser ||
        userDetail.disabledAt
      ) {
        isUserEnabled = false
      }

      redeemDetail = {
        ...transactionDetail.dataValues,
        totalRedeemedAmount: +userReport?.totalRedemptionAmount || 0,
        totalPurchaseAmount: +userReport?.totalPurchaseAmount || 0,
        totalBetAmount: +userReport?.totalScBetAmount || 0,
        totalWinAmount: +userReport?.totalScWinAmount || 0,
        totalGGR: +round(
          minus(+userReport?.totalScBetAmount || 0, +userReport?.totalScWinAmount || 0),
          2
        ) || 0,
        pendingRedemptionAmount: +userReport?.totalPendingRedemptionAmount || 0,
        pendingRedemptionCount: +userReport?.pendingRedemptionCount || 0,
        isUserEnabled,
        userTierLevel: userDetail?.UserTier?.Tier?.level,
        userTierName: userDetail?.UserTier?.Tier?.name
      }

      return {
        data: redeemDetail,
        status: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
