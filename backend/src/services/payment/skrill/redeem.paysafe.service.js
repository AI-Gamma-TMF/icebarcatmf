import axios from 'axios'
import config from '../../../configs/app.config'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { times, plus, divide, round } from 'number-precision'
import { TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import {
  ACCESS_EMAIL_TEMPLATES,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE
} from '../../../utils/constants/constant'
import { sendMail } from '../../../libs/sendgridEmailTemp'
import { userReportsRealTimeJobScheduler } from '../../../utils/common'

export class RedeemPaysafeService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        WithdrawRequest: WithdrawRequestModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { withdrawRequest, user } = this.args

    let errorData = ''
    try {
      const createHandleOptions = {
        url: `${config.get('payment.paysafe.base_url')}/v1/paymenthandles`,
        method: 'POST',
        headers: {
          Simulator: 'EXTERNAL',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${config.get('payment.paysafe.username')}:${config.get(
              'payment.paysafe.password'
            )}`
          ).toString('base64')}`
        },
        data: {
          merchantRefNum: withdrawRequest.transactionId,
          accountId: +config.get('payment.paysafe.account_id'),
          transactionType: 'STANDALONE_CREDIT',
          paymentType: 'SKRILL',
          amount: +times(+withdrawRequest.amount, 100),
          currencyCode: 'USD',
          skrill: {
            consumerId: withdrawRequest.actionableEmail,
            emailSubject: 'Payout has been initiated from The Money Factory ',
            emailMessage: `Payment of $${+withdrawRequest.amount} has been initiated from the The Money Factory.`
          }
        }
      }

      const { data: redeemData } = await axios(createHandleOptions)

      if (redeemData.error) {
        errorData = redeemData
        throw Error('Error in redeem data', redeemData)
      }

      if (redeemData.status !== 'PAYABLE') {
        errorData = redeemData
        throw Error('Amount is not payable')
      }
      const processWithdrawalOptions = {
        url: `${config.get('payment.paysafe.base_url')}/v1/standalonecredits`,
        method: 'POST',
        headers: {
          Simulator: 'EXTERNAL',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${config.get('payment.paysafe.username')}:${config.get(
              'payment.paysafe.password'
            )}`
          ).toString('base64')}`
        },
        data: {
          amount: +redeemData.amount,
          merchantRefNum: redeemData.merchantRefNum,
          currencyCode: 'USD',
          paymentHandleToken: redeemData.paymentHandleToken
        }
      }

      const { data } = await axios(processWithdrawalOptions)

      if (data.status === 'ERROR') {
        errorData = data
        throw Error('Payment processing gave an error')
      }
      if (data?.error) {
        errorData = data
        throw Error('Error in data')
      }

      const beforeBalance = {
        gcCoin: +user.userWallet.gcCoin,
        scCoin: +plus(
          +user.userWallet.scCoin.bsc,
          +user.userWallet.scCoin.psc,
          +user.userWallet.scCoin.wsc,
          +divide(data.amount, 100).toFixed(2)
        ).toFixed(2)
      }

      const afterBalance = {
        gcCoin: +user.userWallet.gcCoin,
        scCoin: +plus(
          +user.userWallet.scCoin.bsc,
          +user.userWallet.scCoin.psc,
          +user.userWallet.scCoin.wsc
        ).toFixed(2)
      }

      let transactionData = {
        actioneeType: ROLE.USER,
        actioneeId: user.userId,
        actioneeEmail: user.email,
        actioneeName: `${user.firstName} ${
          user.middleName ? `${user.middleName} ` : ''
        } ${user.lastName}`,
        walletId: user.userWallet.walletId,
        currencyCode: 'USD',
        amount: +round(+divide(+data.amount, 100), 2),
        countryCode: 'US',
        transactionType: TRANSACTION_TYPE.WITHDRAW,
        paymentMethod: TRANSACTION_PROVIDER.SKRILL,
        paymentTransactionId: data.id,
        gcCoin: 0,
        scCoin: +round(+divide(+data.amount, 100), 2),
        transactionId: withdrawRequest.transactionId,
        moreDetails: data
      }

      let updateWithdrawRequest = {}

      if (data.status === 'COMPLETED') {
        transactionData = {
          ...transactionData,
          status: TRANSACTION_STATUS.SUCCESS,
          isSuccess: true,
          beforeBalance,
          afterBalance
        }

        updateWithdrawRequest = {
          ...updateWithdrawRequest,
          status: TRANSACTION_STATUS.SUCCESS,
          moreDetails: data
        }
        //  send email to approved customer's request:
        sendMail({
          email: user.email,
          userId: user.userId,
          emailTemplate: ACCESS_EMAIL_TEMPLATES.REDEEM_REQUEST_APPROVED,
          dynamicData: {
            email: user.email,
            user_id: user.userId,
            userName: user.username,
            name: `${user.firstName} ${user.lastName}`,
            amount: withdrawRequest.amount,
            status: data.status === 'COMPLETED' ? 'Completed' : '',
            transactionId: withdrawRequest.transactionId,
            processingTime:
              'Your request was processed within the expected time frame .',
            myPlayLink: `${config.get().userFrontendUrl}/bets`
          }
        })

        userReportsRealTimeJobScheduler({
          jobType: 'JOB_REDEEM',
          userId: user.userId,
          amount: +withdrawRequest.amount
        })
      } else if (
        data.status === 'PENDING' ||
        data.status === 'INITIATED' ||
        data.status === 'RECEIVED'
      ) {
        transactionData = {
          ...transactionData,
          status: TRANSACTION_STATUS.INPROGRESS,
          isSuccess: false
        }

        updateWithdrawRequest = {
          ...updateWithdrawRequest,
          status: TRANSACTION_STATUS.INPROGRESS,
          moreDetails: data
        }
      } else if (
        data.status === 'FAILED' ||
        data.status === 'CANCELLED' ||
        data.status === 'EXPIRED'
      ) {
        transactionData = {
          ...transactionData,
          status:
            data.status === 'CANCELLED'
              ? TRANSACTION_STATUS.CANCELED
              : TRANSACTION_STATUS.FAILED,
          isSuccess: false,
          moreDetails: data
        }

        user.userWallet.scCoin = {
          ...user.userWallet.scCoin,
          wsc: +plus(
            +user.userWallet.scCoin.wsc,
            +divide(data.amount, 100).toFixed(2)
          ).toFixed(2)
        }

        await user.userWallet.save({ transaction })

        updateWithdrawRequest = {
          ...updateWithdrawRequest,
          status:
            data.status === 'CANCELLED'
              ? TRANSACTION_STATUS.CANCELED
              : TRANSACTION_STATUS.FAILED,
          moreDetails: data
        }

        WalletEmitter.emitUserWalletBalance(
          {
            scCoin: +round(
              +plus(
                +user.userWallet.scCoin.bsc,
                +user.userWallet.scCoin.psc,
                +user.userWallet.scCoin.wsc
              )
            ).toFixed(2),
            wsc: +user.userWallet.scCoin.wsc.toFixed(2)
          },
          +user.userId
        )

        userReportsRealTimeJobScheduler({
          jobType: 'JOB_REJECTED_REDEEM',
          userId: user.userId,
          amount: +withdrawRequest.amount
        })
      }

      await TransactionBankingModel.create(transactionData, { transaction })
      await WithdrawRequestModel.update(updateWithdrawRequest, {
        where: { transactionId: withdrawRequest.transactionId },
        transaction
      })

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      withdrawRequest.status = TRANSACTION_STATUS.FAILED
      withdrawRequest.moreDetails = { ...withdrawRequest.moreDetails, error: errorData || error.response.data }

      user.userWallet.scCoin = {
        ...user.userWallet.scCoin,
        wsc: +plus(
          +user.userWallet.scCoin.wsc,
          +withdrawRequest.amount
        ).toFixed(2)
      }

      WalletEmitter.emitUserWalletBalance(
        {
          scCoin: +round(
            +plus(
              +user.userWallet.scCoin.bsc,
              +user.userWallet.scCoin.psc,
              +user.userWallet.scCoin.wsc
            ),
            2
          ).toFixed(2),
          wsc: +user.userWallet.scCoin.wsc.toFixed(2)
        },
        user.userId
      )

      userReportsRealTimeJobScheduler({
        // Because we only need to remove redeemed amount ( JOB_REJECTED_REDEEM AND JOB_FAILED_REDEEM both has same work flow )
        jobType: 'JOB_REJECTED_REDEEM',
        userId: user.userId,
        amount: +withdrawRequest.amount
      })

      await withdrawRequest.save({ transaction })
      await user.userWallet.save({ transaction })
      await transaction.commit()
      return this.addError('InternalServerErrorType', error)
    }
  }
}
