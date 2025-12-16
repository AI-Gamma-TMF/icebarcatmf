import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import axios from 'axios'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetSkrillBalanceService extends ServiceBase {
  async run () {
    try {
      const options = {
        method: 'GET',
        url: `${config.get('payment.paysafe.base_url')}/v1/balances`,
        params: {
          // accountId: +config.get('payment.paysafe.account_id'),
          paymentType: 'SKRILL',
          currencyCode: 'USD'
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${config.get('payment.paysafe.username')}:${config.get(
              'payment.paysafe.password'
            )}`
          ).toString('base64')}`
        }
      }

      const data = await axios(options)
      console.log('----- ', data)

      //               ----------WIP--------------
      return { success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
