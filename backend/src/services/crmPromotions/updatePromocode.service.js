import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateCRMPromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel },
      sequelizeTransaction: transaction
    } = this.context

    const { crmPromotionId, name, claimBonus, promotionType, scAmount, gcAmount } = this.args

    if (+scAmount < 0 || +gcAmount < 0) return this.addError('AmountCannotBeLessThenZeroErrorType')

    const findPromocode = await CRMPromotionModel.findOne({
      where: { crmPromotionId },
      transaction
    })

    if (!findPromocode) return this.addError('PromocodeDoesNotExistsErrorType')

    if (name !== findPromocode.name) {
      const options = {
        url: `${config
          .get('optimove.base_url')}/Integrations/AddPromotions`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': config.get('optimove.secret_key')
        },
        data: JSON.stringify([
          {
            PromoCode: findPromocode.promocode,
            PromotionName: name
          }
        ])
      }
      // Updating promotions in optimove servers.
      await axios(options)
    }

    await CRMPromotionModel.update(
      {
        name,
        claimBonus,
        promotionType,
        scAmount,
        gcAmount
      },
      {
        where: {
          crmPromotionId
        },
        transaction
      }
    )

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
