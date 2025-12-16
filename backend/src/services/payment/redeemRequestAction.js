import { round, plus } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TRANSACTION_PROVIDER } from '../../utils/constants/payment'
import { userReportsRealTimeJobScheduler } from '../../utils/common'
import RedeemSkrillPaysafeService from './skrill/redeem.skrill.paysafe'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import { ROLE, ROLE_ID, STATUS_VALUE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import RedeemPayByBankPaysafeService from './payByBank/redeem.payByBank.paysafe'
import RedeemPayByBankTrustlyService from './trustly/redeem.payByBank.trustly'
export class RedeemRequestActionService extends ServiceBase {
  async run () {
    const { status, withdrawRequestId, userId, transactionId } = this.args
    const {
      dbModels: {
        Wallet: WalletModel,
        WithdrawRequest: WithdrawRequestModel,
        ActivityLog: ActivityLogModel
      },
      sequelizeTransaction
    } = this.context

    let query

    let txStatus = TRANSACTION_STATUS.CANCELED

    if (status.toUpperCase() === STATUS_VALUE.APPROVED) txStatus = TRANSACTION_STATUS.SUCCESS
    if (status.toUpperCase() === STATUS_VALUE.REJECTED) txStatus = TRANSACTION_STATUS.DECLINED

    try {
      if (transactionId && transactionId !== '') query = { transactionId }
      else if (withdrawRequestId && withdrawRequestId !== '') query = { withdrawRequestId }

      const withdrawRequestExists = await WithdrawRequestModel.findOne({
        attributes: ['withdrawRequestId', 'transactionId', 'status', 'paymentProvider', 'moreDetails', 'amount', 'actionableEmail'],
        lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WithdrawRequestModel },
        where: { ...query, userId, status: [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.SCHEDULED] },
        transaction: sequelizeTransaction
      })

      if (!withdrawRequestExists) return this.addError('WithdrawRequestNotFoundErrorType')

      if (txStatus === TRANSACTION_STATUS.DECLINED) {
        const userWallet = await WalletModel.findOne({
          where: { ownerId: userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        })

        withdrawRequestExists.status = TRANSACTION_STATUS.DECLINED

        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +round(+plus(+userWallet.scCoin.wsc, +withdrawRequestExists.amount), 2)
        }

        WalletEmitter.emitUserWalletBalance(
          {
            scCoin: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.psc, +userWallet.scCoin.wsc), 2),
            wsc: +round(+userWallet.scCoin.wsc, 2)
          },
          userId
        )

        userReportsRealTimeJobScheduler({ jobType: 'JOB_REJECTED_REDEEM', userId: userId, amount: +withdrawRequestExists.amount })

        await ActivityLogModel.create({
          userId: userId,
          actioneeId: ROLE_ID.ADMIN,
          actioneeType: ROLE.ADMIN,
          fieldChanged: 'status',
          amount: withdrawRequestExists.amount,
          remark: `Redeem request has been declined by the admin of amount ${withdrawRequestExists.amount} and transactionId ${withdrawRequestExists.transactionId}`,
          originalValue: `${withdrawRequestExists.status}`,
          changedValue: `${TRANSACTION_STATUS.DECLINED}`,
          moreDetails: { favorite: false }
        }, { transaction: sequelizeTransaction })

        await withdrawRequestExists.save({ transaction: sequelizeTransaction })
        await userWallet.save({ transaction: sequelizeTransaction })
      } else if (txStatus === TRANSACTION_STATUS.SUCCESS) {
        await ActivityLogModel.create({
          userId: userId,
          actioneeId: ROLE_ID.ADMIN,
          actioneeType: ROLE.ADMIN,
          amount: withdrawRequestExists.amount,
          fieldChanged: 'status',
          remark: `Redeem request has been scheduled for approval by the admin of amount ${withdrawRequestExists.amount} and transactionId ${withdrawRequestExists.transactionId}`,
          originalValue: `${withdrawRequestExists.status}`,
          changedValue: `${TRANSACTION_STATUS.SCHEDULED}`,
          moreDetails: { favorite: false }
        }, { transaction: sequelizeTransaction })

        if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.SKRILL) {
          await RedeemSkrillPaysafeService.execute({ withdrawRequest: withdrawRequestExists }, this.context)
        } else if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.PAY_BY_BANK) {
          await RedeemPayByBankPaysafeService.execute({ withdrawRequest: withdrawRequestExists }, this.context)
        } else if (withdrawRequestExists.paymentProvider === TRANSACTION_PROVIDER.TRUSTLY) {
          await RedeemPayByBankTrustlyService.execute({ withdrawRequest: withdrawRequestExists }, this.context)
        }
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
