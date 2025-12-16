import ServiceBase from '../../libs/serviceBase'
import { redeemRequestAction } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class ApproveAllRedeemRequestService extends ServiceBase {
  async run () {
    const {
      dbModels: { WithdrawRequest: WithdrawRequestModel },
      req,
      sequelizeTransaction: transaction
    } = this.context

    try {
      const allApprovedRequest = await WithdrawRequestModel.findAll({
        where: {
          isApproved: true
        },
        attributes: ['userId', 'withdrawRequestId'],
        raw: true,
        transaction
      })

      if (allApprovedRequest.length > 0) {
        await Promise.all(
          allApprovedRequest.map(async approvedRequest => {
            redeemRequestAction({
              data: {
                status: 'approved',
                withdrawRequestId: `${approvedRequest.withdrawRequestId}`,
                userId: approvedRequest.userId
              },
              req
            })
          })
        )
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
