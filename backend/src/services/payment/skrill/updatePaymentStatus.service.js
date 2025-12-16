import axios from 'axios'
import ServiceBase from '../../../libs/serviceBase'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import config from '../../../configs/app.config'

export class UpdatePaymentStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        WithdrawRequest: WithdrawRequestModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { withdrawRequestId } = this.args
    
    try {
      const withdrawRequestDetail = await WithdrawRequestModel.findOne({
        attributes: ['transactionId', 'paymentProvider'],
        where: {
          withdrawRequestId,
          status: TRANSACTION_STATUS.INPROGRESS
        },
        transaction
      })
            
      if (!withdrawRequestDetail) return this.addError('InternalServerErrorType')

      const options = {
        url: `${config.get('jobScheduler.url')}/transaction/in-progress-redeem`,
        method: 'POST',
        headers: {
          Authorization: `Basic ${config.get('jobScheduler.authKey')}`
        },
        data: {
          transactionId: withdrawRequestDetail.transactionId,
          paymentProvider: withdrawRequestDetail.paymentProvider
        }
      }
  
      const { data } = await axios(options)
      
      if (data.data.success === true) {        
        return {
          success: true,
          message: 'Status check scheduled, will be updated in few minutes.'
        }
      } else {
        return this.addError('InternalServerErrorType')
      }
    } catch (error) {
      console.log('-----error------', error)
      return this.addError('InternalServerErrorType')
    }
  }
}
