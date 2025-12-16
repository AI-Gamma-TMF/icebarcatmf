import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ProvideCRMPromotionBonusService } from './provideBonus.service'

export class TriggeredCampaignsCRMWebhookService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel, Promocode: PromocodeModel },
      sequelizeTransaction: transaction
    } = this.context

    const { customerID: userId, promoCode, campaignID: campaignId, notes } = this.args

    if (!promoCode.length === 0) {
      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    }

    try {
      const promocodeDetails = await CRMPromotionModel.findAll({
        where: {
          promocode: {
            [Op.in]: promoCode
          }
        },
        attributes: ['promocode', 'crmPromocode', 'userIds', 'expireAt'],
        raw: true
      })

      let endTime = null

      const duration = (JSON.parse(notes))?.duration

      if (duration) {
        const current = new Date()
        endTime = new Date(current.setDate(current.getDate() + duration))
      }

      await Promise.all(
        promocodeDetails.map(async promoData => {
          const expireAt = (!promoData.expireAt && endTime) ? endTime : null
          const userList = promoData.userIds || []
          if (!userList.includes(userId)) {
            userList.push(userId)
          }
          await Promise.all([
            CRMPromotionModel.update({ expireAt: expireAt, userIds: userList, campaignId }, { where: { promocode: promoData.promocode }, transaction }),
            (promoData.crmPromocode ? PromocodeModel.update({ validTill: expireAt, userIds: userList }, { where: { promocode: promoData.promocode, crmPromocode: true }, transaction }) : ProvideCRMPromotionBonusService.execute({ promocode: promoData.promocode, playerId: +userId }, this.context))
          ])
        })
      )
    } catch (error) {
      console.log('Error while trigger promotion', error)
    }

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
