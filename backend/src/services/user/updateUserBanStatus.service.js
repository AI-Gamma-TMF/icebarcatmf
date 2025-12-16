import { plus, round } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { sendMail } from '../../libs/sendgridEmailTemp'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { activityLog, clearUserStatuses, redeemRequestAction, updateUserRestrictedStatusScaleo } from '../../utils/common'
import { ACCESS_EMAIL_TEMPLATES, ACTION, ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS, UPDATE_USER_STATUS } from '../../utils/constants/constant'
import redisClient from '../../libs/redisClient'

export class UpdateUserBanStatus extends ServiceBase {
  async run () {
    const { user, userId, reasonId, action, type, favorite, customDescription, isAllowToSentEmail = true, isAccountClose, clearUserWallet = false, clearUserVault = false, cancelRedeemRequest = false } = this.args
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        BanUserSetting: BanUserSettingModel,
        WithdrawRequest: WithdrawRequestModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context
    let field
    let isApplicable = true

    try {
      const userDetails = await UserModel.findOne({
        where: { userId },
        attributes: ['userId', 'isActive', 'isRestrict', 'isBan', 'isInternalUser', 'email', 'username', 'firstName', 'lastName', 'reasonId', 'isClearWallet', 'affiliateCode'],
        transaction
      })

      if (!userDetails) return this.addError('UserNotExistsErrorType')
      const isReasonExist = await BanUserSettingModel.findOne({
        where: {
          reasonId,
          isActive: true
        },
        transaction
      })

      if (reasonId && !isReasonExist) {
        return this.addError('ReasonNotFoundErrorType')
      }
      const clickId = userDetails?.affiliateCode?.replaceAll('-', '') || null
      switch (type) {
        case UPDATE_USER_STATUS.RESTRICT_USER:
          clearUserStatuses(userDetails)
          userDetails.isRestrict = action
          userDetails.reasonId = reasonId
          isReasonExist.reasonCount = +(isReasonExist.reasonCount + 1)
          field = 'isRestrict'
          isApplicable = false
          if (clickId) updateUserRestrictedStatusScaleo(clickId, action)
          break

        case UPDATE_USER_STATUS.BAN_UNBAN_USER:
          clearUserStatuses(userDetails)
          userDetails.isBan = action
          userDetails.reasonId = reasonId
          isReasonExist.reasonCount = +(isReasonExist.reasonCount + 1)
          if (clickId) updateUserRestrictedStatusScaleo(clickId, action)
          field = 'isBan'
          break

        case UPDATE_USER_STATUS.ACTIVE_USER:
          clearUserStatuses(userDetails)
          userDetails.isActive = !action
          userDetails.reasonId = reasonId
          isReasonExist.reasonCount = +(isReasonExist.reasonCount + 1)
          if (clickId) updateUserRestrictedStatusScaleo(clickId, action)
          field = 'isActive'
          break

        case UPDATE_USER_STATUS.INTERNAL_USER:
          if (userDetails.isInternalUser) return this.addError('AlreadyTestUserErrorType')
          userDetails.isInternalUser = action
          userDetails.reasonId = reasonId
          field = 'isInternalUser'
          isApplicable = false
          await redisClient.client.del('internalUsers')
          break
      }

      await userDetails.save({ transaction })
      await isReasonExist.save({ transaction })

      await activityLog({
        user,
        userId,
        fieldChanged: field,
        originalValue: !action,
        changedValue: action,
        remark: reasonId ? isReasonExist.reasonTitle : '',
        favorite,
        transaction
      })

      // cancelRedeemRequest
      if (isAccountClose && cancelRedeemRequest && isApplicable) {
        const getPendingRedeemRequests = await WithdrawRequestModel.findAll({
          where: {
            userId,
            status: TRANSACTION_STATUS.PENDING
          }
        })

        await Promise.all(getPendingRedeemRequests.map(async withdrawRequest => {
          await redeemRequestAction({
            data: {
              status: 'rejected',
              reason: 'User is Disabled',
              withdrawRequestId: `${withdrawRequest.withdrawRequestId}`,
              userId
            },
            req: this.context.req
          })
        }))
      }

      // clear-out the user's vault:
      if (isAccountClose && clearUserVault && isApplicable) {
        const userWallet = await WalletModel.findOne({
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })
        userWallet.gcCoin = +round(+plus(+userWallet.gcCoin, +userWallet.vaultGcCoin), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +userWallet.vaultScCoin.bsc), 2),
          psc: +round(+plus(+userWallet.scCoin.psc, +userWallet.vaultScCoin.psc), 2),
          wsc: +round(+plus(+userWallet.scCoin.wsc, +userWallet.vaultScCoin.wsc), 2)
        }
        userWallet.vaultGcCoin = 0
        userWallet.vaultScCoin = {
          bsc: 0,
          psc: 0,
          wsc: 0
        }
        await userWallet.save({ transaction })
      }
      // end-clear-out the user's vault:

      // clear-out the user's wallet
      if (isAccountClose && clearUserWallet && isApplicable) {
        const userWallet = await WalletModel.findOne({
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })
        if (userDetails.isClearWallet) return this.addError('UserWalletHasBeenAlreadyClearOutErrorType')
        let balanceObj = {
          reason: 'User has been deactivate.',
          beforeScBalance: userWallet.scCoin,
          beforeGcBalance: userWallet.gcCoin
        }
        userWallet.gcCoin = 0
        balanceObj = {
          ...balanceObj,
          afterScBalance: userWallet.scCoin,
          afterGcBalance: userWallet.gcCoin
        }
        const transactionGC = {
          actionType: ACTION.GC_DEDUCT,
          moreDetails: balanceObj,
          sc: 0,
          gc: +round(+balanceObj.beforeGcBalance, 2),
          amountType: AMOUNT_TYPE.GC_COIN
        }
        userWallet.scCoin = {
          bsc: 0,
          psc: 0,
          wsc: 0
        }
        balanceObj = {
          ...balanceObj,
          afterScBalance: userWallet.scCoin,
          afterGcBalance: userWallet.gcCoin
        }
        const transactionSC = {
          actionType: ACTION.SC_DEDUCT,
          moreDetails: balanceObj,
          sc: +round(
            (+balanceObj.beforeScBalance.bsc || 0) +
              (balanceObj.beforeScBalance.psc || 0) +
              (balanceObj.beforeScBalance.wsc || 0),
            2
          ),
          gc: 0,
          amountType: AMOUNT_TYPE.SC_COIN
        }
        let transactionDetails = {
          userId: +userId,
          status: TRANSACTION_STATUS.SUCCESS,
          actionId: ACTION_TYPE.DEBIT,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          roundId: 'NULL',
          transactionId: `${new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
          ).toISOString()}-TRANSACTION`
        }
        transactionDetails = [
          {
            ...transactionDetails,
            ...transactionGC
          },
          {
            ...transactionDetails,
            ...transactionSC
          }
        ]
        userDetails.isClearWallet = true
        await Promise.all([
          userWallet.save({ transaction }),
          userDetails.save({ transaction }),
          CasinoTransactionModel.bulkCreate(transactionDetails, { transaction })
        ])
      }

      // Activate user's wallet
      if (!isAccountClose && userDetails.isClearWallet) {
        const userWallet = await WalletModel.findOne({
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })
        const { moreDetails: details } = await CasinoTransactionModel.findOne({
          attributes: ['actionType', 'moreDetails'],
          where: {
            userId: userId,
            status: TRANSACTION_STATUS.SUCCESS,
            actionId: ACTION_TYPE.DEBIT,
            actionType: ACTION.SC_DEDUCT
          },
          order: [['createdAt', 'DESC']],
          transaction
        })

        const gcBalance = details.beforeGcBalance || 0
        const scBalance = details.beforeScBalance || 0
        let balanceObj = {
          reason: 'User has been Activate.',
          beforeScBalance: {
            bsc: 0,
            psc: 0,
            wsc: 0
          },
          beforeGcBalance: 0
        }
        balanceObj = {
          ...balanceObj,
          afterGcBalance: gcBalance,
          afterScBalance: userWallet.scCoin
        }

        const transactionGC = {
          actionType: ACTION.GC_CREDIT,
          moreDetails: balanceObj,
          sc: 0,
          gc: +round(gcBalance, 2),
          amountType: AMOUNT_TYPE.GC_COIN
        }
        balanceObj = {
          ...balanceObj,
          afterGcBalance: gcBalance,
          afterScBalance: scBalance
        }
        const transactionSC = {
          actionType: ACTION.SC_CREDIT,
          moreDetails: balanceObj,
          sc: +round(
            (+scBalance.bsc || 0) +
              (+scBalance.psc || 0) +
              (+scBalance.wsc || 0),
            2
          ),
          gc: 0,
          amountType: AMOUNT_TYPE.SC_COIN
        }
        let transactionDetails = {
          userId: +userId,
          status: TRANSACTION_STATUS.SUCCESS,
          actionId: ACTION_TYPE.CREDIT,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          roundId: 'NULL',
          transactionId: `${new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
          ).toISOString()}-TRANSACTION`
        }
        transactionDetails = [
          {
            ...transactionDetails,
            ...transactionGC
          },
          {
            ...transactionDetails,
            ...transactionSC
          }
        ]
        userWallet.scCoin = scBalance
        userWallet.gcCoin = gcBalance
        userDetails.isClearWallet = false
        await Promise.all([
          userWallet.save({ transaction }),
          userDetails.save({ transaction }),
          CasinoTransactionModel.bulkCreate(transactionDetails, { transaction })
        ])
      }

      const subjectClose = (field === 'isRestrict' && isAccountClose) ? 'Account Restrict Notification' : 'Account Closure Notification'
      const subjectOpen = (field === 'isRestrict' && !isAccountClose) ? 'Your Account has been Un-Restricted' : 'Your Account Has Been Re-Enabled'

      //  send Email to ban user
      if (isAllowToSentEmail) {
        sendMail({
          email: userDetails.email,
          userId: userDetails.userId,
          emailTemplate: isAccountClose ? ACCESS_EMAIL_TEMPLATES.DEACTIVATE_USER : ACCESS_EMAIL_TEMPLATES.ACTIVATE_USER,
          dynamicData: {
            userName: userDetails?.username,
            reason: reasonId ? isReasonExist?.reasonTitle : '',
            reasonDescription: customDescription,
            subject: isAccountClose ? subjectClose : subjectOpen
          }
        })
      }
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log('Error', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
