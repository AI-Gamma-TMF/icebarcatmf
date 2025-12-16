import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateStatusPromoCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel },
      sequelizeTransaction: transaction
    } = this.context

    const { isActive, promocodeId } = this.args

    await PromotionCodeModel.update(
      { isActive },
      { where: { promocodeId }, transaction }
    )

    const findPromocode = await PromotionCodeModel.findOne({
      where: { promocodeId },
      transaction
    })
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
          status: isActive ? 1 : 3 // Status  1 - Active, 3 - Inactive
        }
      }

      try {
        await axios(option)
      } catch (error) {
        console.log('Error occur in UpdateStatusPromoCodeService', JSON.stringify(error.response.data))
        return this.addError('InternalServerErrorType', error)
      }
    }

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
