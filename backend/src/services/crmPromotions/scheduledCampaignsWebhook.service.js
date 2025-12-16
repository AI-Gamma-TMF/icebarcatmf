import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ProvideCRMPromotionBonusService } from './provideBonus.service'
import { statusUpdateJobScheduler } from '../../utils/common'
import { CRM_PROMOTION_TYPE, PROMOCODE_STATUS } from '../../utils/constants/constant'
import { sequelize } from '../../db/models'

export class ScheduledCampaignsCRMWebhookService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel, Promocode: PromocodeModel },
      sequelizeTransaction: transaction
    } = this.context

    const { ChannelID: channelId, CampaignID: campaignId } = this.args

    if (config.get('env') === 'production') {
      const options = {
        url: 'https://chat.googleapis.com/v1/spaces/AAQA1MBsS7U/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=k5AW9PFOLHP2G5by8HVf72vOVDmdynMrrzWpVwB9alE',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          text: `scheduled webhook Data ${JSON.stringify(this.args, null, 2)}`
        }
      }
      await axios(options)
    }

    const moreDetails = this.args

    const campaignDetailOption = {
      url: `${config.get('optimove.base_url')}/Actions/GetCampaignDetails?campaignId=${campaignId}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      }
    }

    const { data: campaignDetails } = await axios(campaignDetailOption)
    moreDetails.Channels = campaignDetails.Channels
    moreDetails.Duration = campaignDetails.Duration

    let endDate, startDate

    const userList = []
    const pageSize = 20000
    let skip = 0
    let hasMoreData = true

    let isPromoFlag = true
    let allPromo
    let scheduledTime

    while (hasMoreData) {
      const userListOptions = {
        url: `${config.get('optimove.base_url')}/Customers/GetCustomerExecutionDetailsByCampaign?CampaignID=${campaignId}&ChannelID=${channelId}&$top=${pageSize}&$skip=${skip}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': config.get('optimove.secret_key')
        }
      }
      const { data: userListData } = await axios(userListOptions)

      if (isPromoFlag) {
        allPromo = userListData.length ? userListData[0].PromoCode.split(',') : []
        scheduledTime = userListData.length ? userListData[0].ScheduleTime : null
        isPromoFlag = false

        startDate = new Date(scheduledTime)
        endDate = new Date(scheduledTime)
        endDate.setDate(endDate.getDate() + campaignDetails?.Duration)

        moreDetails.StartDate = new Date(scheduledTime)
        moreDetails.EndDate = endDate
      }

      if (userListData.length > 0) {
        const userIds = userListData.map(user => { return +user.CustomerID })
        moreDetails.Users = userList

        userList.push(...userIds)
        skip += pageSize
      } else {
        hasMoreData = false
      }

      if (userListData.length < pageSize) hasMoreData = false
    }

    const promocodeDetails = await sequelize.query(`
      SELECT DISTINCT ON (promocode) 
        promocode, crm_promocode AS "crmPromocode", expire_at AS "expireAt", name, 
        sc_amount AS "scAmount", gc_amount AS "gcAmount", campaign_id AS "campaignId", 
        crm_promotion_id AS "crmPromotionId"
      FROM "crm_promotions"
      WHERE promocode IN (:allPromo)
      ORDER BY promocode, "created_at" DESC`
    , {
      replacements: { allPromo },
      transaction,
      type: sequelize.QueryTypes.SELECT
    })

    await Promise.all(
      promocodeDetails.map(async promoData => {
        let crmPromotionId = +promoData.crmPromotionId
        let promocodeId
        let promocodeModelDetail
        // Ignore web hook if repeated call from optimove
        const isDuplicateWebhook = await CRMPromotionModel.findOne({
          attributes: ['crmPromotionId'],
          where: {
            promocode: promoData.promocode,
            name: promoData.name,
            claimBonus: true,
            promotionType: CRM_PROMOTION_TYPE.SCHEDULED,
            scAmount: promoData.scAmount,
            gcAmount: promoData.gcAmount,
            crmPromocode: promoData.crmPromocode,
            validFrom: startDate,
            expireAt: endDate,
            campaignId: `${campaignId}`,
            userIds: userList
          },
          transaction,
          raw: true
        })
        if (isDuplicateWebhook) return

        // check if this is a CRM Promocode then find the promocode id with details
        if (promoData.crmPromocode) {
          promocodeModelDetail = await PromocodeModel.findOne({
            attributes: ['promocodeId', 'promocode', 'status', 'discountPercentage', 'perUserLimit', 'isDiscountOnAmount', 'description', 'maxUsersAvailed', 'package'],
            where: { promocode: promoData.promocode, crmPromocode: promoData.crmPromocode },
            sort: [['created_at', 'DESC']],
            raw: true,
            transaction
          })
          promocodeId = promocodeModelDetail.promocodeId
        }

        if (promoData.campaignId && promoData.expireAt) {
          let newCrmPromocode

          if (promoData.crmPromocode) {
            newCrmPromocode = await PromocodeModel.create({
              promocode: promoData.promocode,
              status: PROMOCODE_STATUS.UPCOMING,
              discountPercentage: promocodeModelDetail.discountPercentage,
              perUserLimit: promocodeModelDetail.perUserLimit,
              isDiscountOnAmount: promocodeModelDetail.isDiscountOnAmount,
              crmPromocode: promoData.crmPromocode,
              promotionName: promoData.name,
              promotionType: CRM_PROMOTION_TYPE.SCHEDULED,
              description: promocodeModelDetail.description,
              maxUsersAvailed: promocodeModelDetail.maxUsersAvailed,
              package: promocodeModelDetail.package
            }, { transaction })

            promocodeId = newCrmPromocode.promocodeId
          }
          const newCrmData = await CRMPromotionModel.create({
            promocode: promoData.promocode,
            name: promoData.name,
            claimBonus: true,
            promotionType: CRM_PROMOTION_TYPE.SCHEDULED,
            status: PROMOCODE_STATUS.UPCOMING,
            scAmount: promoData.scAmount,
            gcAmount: promoData.gcAmount,
            crmPromocode: promoData.crmPromocode
          }, { transaction })

          crmPromotionId = newCrmData.crmPromotionId
        }

        await Promise.all(
          [
            CRMPromotionModel.update({ expireAt: endDate, validFrom: startDate, campaignId, userIds: userList, moreDetails }, { where: { crmPromotionId: crmPromotionId }, transaction }),
            (promoData.crmPromocode ? PromocodeModel.update({ validTill: endDate, validFrom: startDate, userIds: userList, moreDetails: { ...moreDetails, crmPromotionId: crmPromotionId } }, { where: { promocodeId: promocodeId, crmPromocode: true }, transaction }) : ProvideCRMPromotionBonusService.execute({ crmPromotionId: crmPromotionId, userList, endDate, startDate }, this.context))
          ]
        )
        // Scheduled the promocode job
        if (promoData.crmPromocode) {
          statusUpdateJobScheduler('POST', 'promocode', promocodeId)
        } else {
          statusUpdateJobScheduler('POST', 'crmPromotion', crmPromotionId)
        }
      })
    )

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
