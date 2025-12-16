import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { statusUpdateJobScheduler } from '../../utils/common'

export class DeleteCRMPromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { CRMPromotion: CRMPromotionModel },
      sequelizeTransaction: transaction
    } = this.context

    const { promocode } = this.args

    const findPromocode = await CRMPromotionModel.findOne({
      where: { promocode },
      transaction
    })

    if (!findPromocode) return this.addError('PromocodeDoesNotExistsErrorType')

    const options = {
      url: `${config.get('optimove.base_url')}/Integrations/DeletePromotions`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify([
        {
          PromoCode: promocode
        }
      ])
    }
    // Deleting promotions in optimove servers.
    await axios(options)

    await CRMPromotionModel.destroy({ where: { promocode }, transaction })

    statusUpdateJobScheduler('DELETE', 'crmPromotion', +findPromocode.crmPromotionId)

    return {
      success: true,
      message: SUCCESS_MSG.DELETE_SUCCESS
    }
  }
}
