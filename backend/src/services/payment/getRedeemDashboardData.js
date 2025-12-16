import sequelize from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetRedeemDashboardDataService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        WithdrawRequest: WithdrawRequestModel
      }
    } = this.context

    try {
      const redeemDashboardData = await WithdrawRequestModel.findAll({
        attributes: [
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.SUCCESS}' THEN 1 ELSE 0 END)`), 'approvedCount'],
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.SUCCESS}' THEN amount ELSE 0 END)`), 'approvedAmount'],
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.PENDING}' THEN 1 ELSE 0 END)`), 'pendingCount'],
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.PENDING}' THEN amount ELSE 0 END)`), 'pendingAmount'],
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.SCHEDULED}' THEN 1 ELSE 0 END)`), 'scheduledCount'],
          [sequelize.literal(`SUM(CASE WHEN status = '${TRANSACTION_STATUS.SCHEDULED}' THEN amount ELSE 0 END)`), 'scheduledAmount'],
          [sequelize.literal(`AVG(CASE WHEN status = '${TRANSACTION_STATUS.SUCCESS}' THEN EXTRACT(EPOCH FROM (updated_at - created_at)) ELSE NULL END)`), 'avgProcessingTime']
        ],
        raw: true
      })

      // Convert avgProcessingTime from seconds to hours and minutes
      const avgProcessingTime = redeemDashboardData[0].avgProcessingTime
      let formattedTime = '0 h 0 m'

      if (avgProcessingTime) {
        const hours = Math.floor(avgProcessingTime / 3600)
        const minutes = Math.floor((avgProcessingTime % 3600) / 60)
        formattedTime = `${hours}h ${minutes}m`
      }

      return { redeemDashboardData: { ...redeemDashboardData[0], avgProcessingTime: formattedTime }, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
