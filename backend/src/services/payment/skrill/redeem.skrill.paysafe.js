import axios from 'axios'
import config from '../../../configs/app.config'
import ServiceBase from '../../../libs/serviceBase'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'

export default class RedeemSkrillPaysafeService extends ServiceBase {
  async run () {
    const {
      dbModels: { WithdrawRequest: WithdrawRequestModel },
      sequelizeTransaction: transaction
    } = this.context

    const { withdrawRequest } = this.args

    await WithdrawRequestModel.update(
      {
        status: TRANSACTION_STATUS.SCHEDULED // Sending the request to be processed on scheduler server.
      },
      {
        where: { transactionId: withdrawRequest.transactionId },
        transaction
      }
    )

    const options = {
      url: `${config.get('jobScheduler.url')}/transaction/skrill-redeem`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${config.get('jobScheduler.authKey')}`
      },
      data: {
        withdrawRequestId: +withdrawRequest.withdrawRequestId
      }
    }

    const { data } = await axios(options)
    if (data.data.success === true) {
      return {
        success: true,
        message: 'Job Added Successfully'
      }
    } else {
      return this.addError('InternalServerErrorType')
    }
  }
}
