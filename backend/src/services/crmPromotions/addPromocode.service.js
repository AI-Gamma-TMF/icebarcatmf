import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { isDateValid } from '../../utils/common'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'

export class AddCRMPromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel },
      sequelizeTransaction: transaction
    } = this.context

    let { promocode, name, claimBonus = true, promotionType, scAmount = 0, gcAmount = 0, crmPromocode = false, validTill, validFrom } = this.args

    if (scAmount < 0 || gcAmount < 0) return this.addError('AmountCannotBeLessThenZeroErrorType')
    if (validTill && !isDateValid(validTill)) return this.addError('InvalidDateErrorType')
    if (validTill) validTill = new Date(validTill)

    const findPromocode = await CRMPromotionModel.findOne({
      attributes: ['promocode'],
      where: { promocode },
      transaction,
      raw: true
    })

    if (findPromocode) return this.addError('PromocodeAlreadyExistsErrorType')

    const options = {
      url: `${config.get('optimove.base_url')}/Integrations/AddPromotions`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify([
        {
          PromoCode: promocode,
          PromotionName: name
        }
      ])
    }
    // Adding promotions in optimove servers.
    try {
      await axios(options)
      await CRMPromotionModel.create(
        {
          promocode,
          name,
          claimBonus,
          promotionType,
          status: PROMOCODE_STATUS.UPCOMING,
          scAmount,
          gcAmount,
          expireAt: validTill,
          validFrom: validFrom,
          crmPromocode
        },
        { transaction }
      )
      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      console.log('Error While Adding CRMPromocode', error?.response?.data)
      return this.addError('InternalServerErrorType', error?.response?.data)
    }
  }
}
