import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getAffiliateByDetails, isDateValid } from '../../utils/common'

export class CreatePromoCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel },
      sequelizeTransaction: transaction
    } = this.context

    let endDate = {}
    let externalPromocodeId
    let {
      promocode,
      affiliateId,
      bonusSc,
      bonusGc,
      validTill = null,
      maxUses = null
    } = this.args

    if (!(+bonusGc && +bonusGc > 0) || !(+bonusSc && +bonusSc > 0)) return this.addError('InvalidAmountErrorType')

    const promocodeExist = await PromotionCodeModel.findOne({
      where: { promocode: promocode }
    })

    if (promocodeExist) return this.addError('PromocodeAlreadyExistErrorType')

    if (validTill && !isDateValid(validTill)) return this.addError('InvalidDateErrorType')
    if (validTill) {
      validTill = new Date(validTill)
      endDate = { end_date: validTill.toISOString().slice(0, 10) }
    }
    console.log(validTill)
    affiliateId = await getAffiliateByDetails(affiliateId)

    const option = {
      url: `${config.get('scaleo.base_url')}/api/v2/network/promo-codes`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'api-key': config.get('scaleo.api_key')
      },
      data: {
        code: promocode,
        status: '1', // active
        affiliate_id: affiliateId + '',
        offer_id: '1',
        ...endDate
      }
    }
    try {
      console.log(option)
      const { data: { info: { promoCode } } } = await axios(option)
      externalPromocodeId = promoCode?.id
    } catch (error) {
      console.log('Error occur in CreatePromoCodeService', JSON.stringify(error.response.data))
      return this.addError('InternalServerErrorType', error)
    }
    await PromotionCodeModel.create(
      {
        promocode,
        affiliateId,
        bonusGc,
        bonusSc,
        validTill,
        maxUses,
        externalPromocodeId
      },
      {
        transaction
      }
    )

    return {
      success: true,
      message: SUCCESS_MSG.CREATE_SUCCESS
    }
  }
}
