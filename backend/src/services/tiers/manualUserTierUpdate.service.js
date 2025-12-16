import ServiceBase from '../../libs/serviceBase'
import { Op } from 'sequelize'
import { BONUS_STATUS, BONUS_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class ManualUserTierUpdateService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tier: TierModel,
        UserTier: UserTierModel,
        Bonus: BonusModel,
        UserBonus: UserBonusModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { userId, tierId } = this.args

    // // step1: first check tier is exist or not
    const [findTier, findUserTier] = await Promise.all([
      (
        TierModel.findOne({
          where: {
            tierId
          },
          raw: true,
          transaction
        })
      ),
      (
        UserTierModel.findOne({
          where: {
            userId
          },
          raw: true,
          transaction
        })
      )
    ])
    if (!findTier) return this.addError('TierNotFoundErrorType')
    if (!findUserTier) return this.addError('UserTierNotFoundErrorType')

    const promotedTierLevel = findTier.level
    const userCurrentTierLevel = findUserTier.level
    if (!(promotedTierLevel > userCurrentTierLevel)) return this.addError('PromotedTierLevelMustBeGreaterErrorType')

    await UserTierModel.update({
      promotedTierLevel,
      tierId: +findTier.tierId,
      level: +findTier.level,
      maxLevel: +findTier.level

    },
    {
      where: { userId },
      transaction
    })

    // Insert bonuses for intermediate levels as Expired
    const bonusData = await BonusModel.findOne({
      attributes: ['bonusId'],
      where: {
        isActive: true,
        bonusType: BONUS_TYPE.TIER_BONUS
      },
      raw: true,
      transaction
    })
    if (!bonusData) return this.addError('BonusNotExistErrorType')

    const tierDetails = await TierModel.findAll({
      where: {
        level: {
          [Op.between]: [userCurrentTierLevel + 1, promotedTierLevel]
        }
      },
      transaction,
      raw: true
    })

    const bonusEntries = tierDetails.map((tierDetail) => ({
      bonusId: bonusData.bonusId,
      userId: userId,
      bonusType: BONUS_TYPE.TIER_BONUS,
      scAmount: +tierDetail.bonusSc,
      gcAmount: +tierDetail.bonusGc,
      status: BONUS_STATUS.EXPIRED,
      tierId: +tierDetail.tierId
    }))

    await UserBonusModel.bulkCreate(bonusEntries, { transaction })

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
