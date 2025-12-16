import ServiceBase from '../../libs/serviceBase'
import {
  BONUS_STATUS,
  BONUS_TYPE,
  CRM_PROMOTION_TYPE
} from '../../utils/constants/constant'

export class ProvideCRMPromotionBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Bonus: BonusModel,
        UserBonus: UserBonusModel,
        CRMPromotion: CRMPromotionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { crmPromotionId, playerId, endDate, startDate } = this.args

    let userList = this.args?.userList

    const crmPromotionDetails = await CRMPromotionModel.findOne({
      where: { crmPromotionId },
      raw: true,
      transaction
    })

    if (!crmPromotionDetails) {
      return this.addError('PromocodeDoesNotExistsErrorType')
    }

    const promotionBonus = await BonusModel.findOne({
      where: { bonusType: BONUS_TYPE.PROMOTION_BONUS, isActive: true },
      transaction
    })

    if (!promotionBonus) return this.addError('PromotionalBonusNotExistErrorType')

    if (playerId && crmPromotionDetails.promotionType === CRM_PROMOTION_TYPE.TRIGGERED) {
      if (crmPromotionDetails.claimBonus) {
        const findAlreadyCreated = await UserBonusModel.findOne({
          attributes: ['userId'],
          where: {
            promocodeId: +crmPromotionDetails.crmPromotionId,
            status: BONUS_STATUS.PENDING
          },
          transaction
        })

        if (findAlreadyCreated?.userId === +playerId) return { success: true }
        const userBonusObj = {
          bonusId: promotionBonus.bonusId,
          userId: +playerId,
          bonusType: BONUS_TYPE.PROMOTION_BONUS,
          scAmount: +crmPromotionDetails.scAmount,
          gcAmount: +crmPromotionDetails.gcAmount,
          status: BONUS_STATUS.PENDING,
          promocodeId: +crmPromotionDetails.crmPromotionId,
          claimedAt: null
        }

        await UserBonusModel.create(userBonusObj, { transaction })
      }
    } else {
      if (crmPromotionDetails.claimBonus) {
        const findAlreadyCreated = (await UserBonusModel.findAll({
          attributes: ['userId'],
          where: {
            promocodeId: +crmPromotionDetails.crmPromotionId
          },
          transaction
        })).map(user => +user.userId)

        userList = userList.filter(userId => !findAlreadyCreated.includes(+userId))

        const batchBonusData = await Promise.all(
          userList.map(userId => {
            return {
              bonusId: promotionBonus.bonusId,
              userId: +userId,
              bonusType: BONUS_TYPE.PROMOTION_BONUS,
              scAmount: +crmPromotionDetails.scAmount,
              gcAmount: +crmPromotionDetails.gcAmount,
              status: BONUS_STATUS.PENDING,
              promocodeId: +crmPromotionDetails.crmPromotionId,
              claimedAt: null,
              expireAt: endDate,
              validFrom: startDate
            }
          })
        )

        await UserBonusModel.bulkCreate(batchBonusData, { transaction })
      }
    }

    return { success: true }
  }
}
