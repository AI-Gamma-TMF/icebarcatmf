import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeletePromoCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel },
      sequelizeTransaction: transaction
    } = this.context

    const { promocodeId } = this.args

    const promocodeDetail = await PromotionCodeModel.findOne({
      where: { promocodeId },
      transaction
    })

    await PromotionCodeModel.destroy({ where: { promocodeId }, transaction })

    if (promocodeDetail?.externalPromocodeId) {
      const option = {
        url: `${config.get(
          'scaleo.base_url'
        )}/api/v2/network/promo-codes/${promocodeDetail.externalPromocodeId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          'api-key': config.get('scaleo.api_key')
        }
      }

      try {
        await axios(option)
      } catch (error) {
        console.log('Error occur in DeletePromoCodeService', JSON.stringify(error.response.data))
        return this.addError('InternalServerErrorType', error)
      }
    }

    return {
      success: true,
      message: SUCCESS_MSG.DELETE_SUCCESS
    }
  }
}
