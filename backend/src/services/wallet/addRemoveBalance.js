import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  AMOUNT_TYPE,
  ROLE,
  ROLE_MAP,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WALLET_OPERATION_TYPE
} from '../../utils/constants/constant'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    coinType: { type: 'string' },
    operationType: { type: 'number' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    remarks: { type: 'string' }
  },
  required: ['userId', 'coinType', 'operationType', 'remarks']
}
const constraints = ajv.compile(schema)

export class AddRemoveBalanceService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // const transaction = this.context.sequelizeTransaction
    const { userId, coinType, operationType, gcAmount, scAmount, remarks } = this.args
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        Country: CountryModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const user = this.context.req.user.detail.get({ plain: true })
    const adminGcLimitAmt = user?.gcLimit || null
    const adminScLimitAmt = user?.scLimit || null
    try {
      if (coinType === 'gc' && adminGcLimitAmt && +gcAmount > +adminGcLimitAmt) {
        return this.addError('YouCannotAddOrDeductMoreThanAllowedGcLimitErrorType')
      } else if ((coinType === 'sc' || coinType === 'bsc' || coinType === 'psc' || coinType === 'wsc') &&
                 (adminScLimitAmt && +scAmount > +adminScLimitAmt)) {
        return this.addError('YouCannotAddOrDeductMoreThanAllowedScLimitErrorType')
      } else if (coinType === 'both') {
        if (adminGcLimitAmt && +gcAmount > +adminGcLimitAmt) {
          return this.addError('YouCannotAddOrDeductMoreThanAllowedGcLimitErrorType')
        }
        if (adminScLimitAmt && +scAmount > +adminScLimitAmt) {
          return this.addError('YouCannotAddOrDeductMoreThanAllowedScLimitErrorType')
        }
      }
      const userDetails = await UserModel.findOne({
        where: { userId },
        transaction
      })

      if (!userDetails) return this.addError('UserNotExistsErrorType')

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })
      userWallet.reload({
        lock: {
          level: transaction.LOCK.UPDATE,
          of: WalletModel
        },
        transaction
      })
      const initialAmount = coinType === 'gc' ? userWallet.gcCoin : userWallet.totalScCoin
      const beforeBalance = {
        gcCoin: userWallet.gcCoin,
        scCoin: userWallet.scCoin
      }

      let name = userDetails.firstName
      if (userDetails.lastName) name = name + ' ' + userDetails.lastName
      const userCountry = await CountryModel.findOne({
        attributes: ['code'],
        where: { countryId: userDetails?.countryCode },
        raw: true
      })
      let transactionDetails = {
        actioneeType: ROLE_MAP[user.roleId] || ROLE.ADMIN,
        actioneeId: userDetails?.userId,
        actioneeEmail: userDetails?.email,
        actioneeName: name,
        walletId: userWallet?.walletId,
        amount: 0,
        currencyCode: userWallet?.currencyCode || 'USD',
        countryCode: userCountry?.code || 'US',
        beforeBalance: beforeBalance,
        primaryCurrencyAmount: 0,
        adminId: userDetails?.parentId,
        isFirstDeposit: false,
        status: TRANSACTION_STATUS.SUCCESS,
        transactionDateTime: new Date().toISOString(),
        isSuccess: true,
        transaction,
        moreDetails: {
          remarks: remarks,
          adminUserId: user?.adminUserId,
          coinType
        }
      }

      if (operationType === WALLET_OPERATION_TYPE.ADD) {
        if (coinType === 'gc') {
          userWallet.gcCoin = parseFloat(
            (userWallet.gcCoin + gcAmount).toFixed(2)
          )
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_GC,
              gcCoin: gcAmount,
              amount: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'sc') {
          // if sc select then it amount add to the bsc
          userWallet.scCoin = {
            ...userWallet.scCoin,
            psc: +userWallet.scCoin.psc,
            bsc: +parseFloat(+userWallet.scCoin.bsc + +scAmount).toFixed(2)
          }
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'psc') {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            psc: +parseFloat(+userWallet.scCoin.psc + +scAmount).toFixed(2)
          }
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'bsc') {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +parseFloat(+userWallet.scCoin.bsc + +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'wsc') {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            wsc: +parseFloat(+userWallet.scCoin.wsc + +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'both') {
          userWallet.gcCoin = parseFloat(
            (userWallet.gcCoin + gcAmount).toFixed(2)
          )
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +parseFloat(+userWallet.scCoin.bsc + +scAmount).toFixed(2)
          }
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_GC,
              gcCoin: gcAmount,
              amount: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            },
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.ADD_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        }
      } else {
        if (coinType === 'gc') {
          if (+gcAmount > +userWallet.gcCoin) return this.addError('InsufficientGcBalanceError')
          userWallet.gcCoin = parseFloat((+userWallet.gcCoin - +gcAmount).toFixed(2))

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_GC,
              gcCoin: gcAmount,
              amount: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'sc') {
          if (+scAmount > +(userWallet.scCoin.bsc + userWallet.scCoin.psc + userWallet.scCoin.wsc)) return this.addError('InsufficientScBalanceError')
          let remainingAmount = 0
          if (+userWallet.scCoin.bsc >= +scAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: +parseFloat(+userWallet.scCoin.bsc - +scAmount).toFixed(2)
            }
          } else {
            remainingAmount = +parseFloat(+scAmount - +userWallet.scCoin.bsc).toFixed(2)
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: 0
            }
            if (+userWallet.scCoin.psc >= +remainingAmount) {
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: +parseFloat(+userWallet.scCoin.psc - +remainingAmount).toFixed(2)
              }
            } else {
              remainingAmount = +parseFloat(+remainingAmount - +userWallet.scCoin.psc).toFixed(2)
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: 0
              }
              if (+userWallet.scCoin.wsc < +remainingAmount) return this.addError('InsufficientScBalanceError')
              userWallet.scCoin = {
                ...userWallet.scCoin,
                wsc: +parseFloat(+userWallet.scCoin.wsc - +remainingAmount).toFixed(2)
              }
            }
          }
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'psc') {
          if (+scAmount > +userWallet.scCoin.psc) return this.addError('InsufficientPScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            psc: +parseFloat(+userWallet.scCoin.psc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'bsc') {
          if (+scAmount > +userWallet.scCoin.bsc) return this.addError('InsufficientBScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +parseFloat(+userWallet.scCoin.bsc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'wsc') {
          if (+scAmount > +userWallet.scCoin.wsc) return this.addError('InsufficientWScBalanceError')

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +userWallet.scCoin.bsc,
            wsc: +parseFloat(+userWallet.scCoin.wsc - +scAmount).toFixed(2)
          }

          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        } else if (coinType === 'both') {
          if (gcAmount > userWallet.gcCoin) return this.addError('InsufficientGcBalanceError')
          if (+scAmount > +(userWallet.scCoin.bsc + userWallet.scCoin.psc + userWallet.scCoin.wsc)) return this.addError('InsufficientScBalanceError')
          userWallet.gcCoin = parseFloat(
            (userWallet.gcCoin - gcAmount).toFixed(2)
          )
          let remainingAmount = 0
          if (+userWallet.scCoin.bsc >= +scAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: +parseFloat(+userWallet.scCoin.bsc - +scAmount).toFixed(2)
            }
          } else {
            remainingAmount = +parseFloat(+scAmount - +userWallet.scCoin.bsc).toFixed(2)
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: 0
            }
            if (+userWallet.scCoin.psc >= +remainingAmount) {
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: +parseFloat(+userWallet.scCoin.psc - +remainingAmount).toFixed(2)
              }
            } else {
              remainingAmount = +parseFloat(+remainingAmount - +userWallet.scCoin.psc).toFixed(2)
              userWallet.scCoin = {
                ...userWallet.scCoin,
                psc: 0
              }
              if (+userWallet.scCoin.wsc < +remainingAmount) return this.addError('InsufficientScBalanceError')
              userWallet.scCoin = {
                ...userWallet.scCoin,
                wsc: +parseFloat(+userWallet.scCoin.wsc - +remainingAmount).toFixed(2)
              }
            }
          }
          transactionDetails = [
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.GC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_GC,
              gcCoin: gcAmount,
              amount: gcAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            },
            {
              ...transactionDetails,
              amountType: AMOUNT_TYPE.SC_COIN,
              transactionType: TRANSACTION_TYPE.REMOVE_SC,
              scCoin: scAmount,
              amount: scAmount,
              afterBalance: {
                gcCoin: userWallet.gcCoin,
                scCoin: userWallet.scCoin
              }
            }
          ]
        }
      }
      await userWallet.save({ transaction })

      await TransactionBankingModel.bulkCreate(transactionDetails, {
        transaction
      })
      await transaction.commit()
      const walletDetails = await WalletModel.findOne({
        where: { ownerId: userId }
      })
      const updatedAmount = coinType === 'gc' ? walletDetails.gcCoin : walletDetails.totalScCoin
      await activityLog({
        user,
        userId,
        fieldChanged: `${coinType.toUpperCase()} Amount`,
        originalValue: initialAmount,
        changedValue: updatedAmount,
        remark: remarks
      })

      WalletEmitter.emitUserWalletBalance(
        {
          scCoin: (
            Math.round(
              (+walletDetails.scCoin?.psc +
                +walletDetails.scCoin?.bsc +
                +walletDetails.scCoin?.wsc) *
                100
            ) / 100
          ).toFixed(2),
          gcCoin: walletDetails.gcCoin
        },
        userDetails.userId
      )
      if (operationType === WALLET_OPERATION_TYPE.ADD) return { success: true, message: SUCCESS_MSG.DEPOSIT_SUCCESS }
      else return { success: true, message: SUCCESS_MSG.WITHDRAW_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      this.addError('InternalServerErrorType', error)
    }
  }
}
