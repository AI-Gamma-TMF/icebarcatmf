import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { tierGlobalSettingData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { divide, times } from 'number-precision'

const schema = {
  type: 'object',
  properties: {
    tierId: { type: 'string' },
    expiryDate: { type: 'string' },
    reason: { type: ['string', 'null'] },
    userId: { type: 'string' }

  },
  required: ['userId', 'tierId', 'expiryDate']
}

const constraints = ajv.compile(schema)
export class UpdateVipUserTierService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { UserTier: UserTierModel, Tier: TierModel }, sequelizeTransaction: transaction } = this.context
    const { userId, tierId, expiryDate, reason } = this.args

    try {
      const [userTierRecord, { SC_TO_GC_RATE, XP_SC_TO_GC_RATE }, tierData] = await Promise.all([
        UserTierModel.findOne({
          attributes: ['tierId', 'moreDetails', 'scSpend', 'gcSpend'],
          where: { userId },
          lock: { level: transaction.LOCK.UPDATE, of: UserTierModel },
          transaction: transaction
        }),
        tierGlobalSettingData({ transaction: transaction }),
        TierModel.findOne({
          where: { isActive: true, tierId },
          order: [['level']],
          raw: true,
          transaction
        })
      ])

      if (!userTierRecord) return this.addError('UserTierNotFoundErrorType')
      if (!tierData) return this.addError('TierNotFoundErrorType')
      const previousXp = userTierRecord.scSpend + divide(userTierRecord.gcSpend, times(SC_TO_GC_RATE, XP_SC_TO_GC_RATE))
      const moreDetails = { tierUpdateDate: new Date(), expiryDate, reason, previousTierId: userTierRecord?.tierId, isManualUpdatedTier: true, previousXp }
      await UserTierModel.update({ tierId, level: +tierData.level, moreDetails }, { where: { userId }, transaction })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
    }
  }
}
