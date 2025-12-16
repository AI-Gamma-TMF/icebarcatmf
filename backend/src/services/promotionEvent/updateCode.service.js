import axios from 'axios'
import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getAffiliateByDetails, isDateValid } from '../../utils/common'

export class UpdatePromoCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel },
      sequelizeTransaction: transaction
    } = this.context

    let {
      promocodeId,
      promocode,
      affiliateId,
      bonusGc,
      bonusSc,
      validTill = null,
      maxUses = null
    } = this.args
    let endDate = {}
    if (!(+bonusGc && +bonusGc > 0) || !(+bonusSc && +bonusSc > 0)) return this.addError('InvalidAmountErrorType')

    affiliateId = await getAffiliateByDetails(affiliateId)

    if (!isDateValid(validTill)) return this.addError('InvalidDateErrorType')

    if (validTill) {
      validTill = new Date(validTill)
      endDate = { end_date: `${validTill.toISOString().substring(0, 10)}` }
    }

    const isPromocodeExist = await PromotionCodeModel.findOne({
      where: {
        promocode,
        promocodeId: { [Op.not]: promocodeId }
      }
    })

    if (isPromocodeExist) return this.addError('PromocodeAlreadyExistErrorType')

    await PromotionCodeModel.update(
      {
        affiliateId,
        bonusGc,
        bonusSc,
        validTill,
        promocode,
        maxUses
      },
      {
        where: {
          promocodeId
        },
        transaction
      }
    )

    const findPromocode = await PromotionCodeModel.findOne({ where: { promocodeId }, transaction })
    if (findPromocode?.externalPromocodeId) {
      const option = {
        url: `${config.get(
          'scaleo.base_url'
        )}/api/v2/network/promo-codes/${findPromocode?.externalPromocodeId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          'api-key': config.get('scaleo.api_key')
        },
        data: {
          code: promocode,
          affiliate_id: affiliateId + '',
          offer_id: '1',
          ...endDate
        }
      }
      try {
        await axios(option)
      } catch (error) {
        console.log('Error occur in UpdatePromoCodeService', JSON.stringify(error.response.data))
        return this.addError('InternalServerErrorType', error)
      }
    }

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
