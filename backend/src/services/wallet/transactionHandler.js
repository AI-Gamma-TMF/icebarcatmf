import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { AMOUNT_TYPE, ROLE } from '../../utils/constants/constant'
import { getPrimaryCurrencyAmount } from '../../utils/common'

const schema = {
  type: 'object',
  required: ['sourceUser', 'targetUser', 'addAmount', 'transaction', 'transactionType']
}
const constraints = ajv.compile(schema)

export class TransactionHandlerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      sourceUser, targetUser, transaction, amountType, addAmount, conversionRate, status, transactionType, paymentTransactionId,
      options, isSuccess, beforeBalance
    } = this.args
    let balance = beforeBalance
    let rate = conversionRate
    let role, id

    try {
      if (!targetUser.userWallet) return { err_type: 'BadData', err: 'Wallet not found', success: false }

      if (amountType && amountType === AMOUNT_TYPE.NON_CASH) {
        balance = Math.abs(targetUser.userWallet.nonCashAmount.toFixed(2))
      } else {
        if (!beforeBalance) balance = Math.abs(targetUser.userWallet.amount.toFixed(2))
      }

      const primaryCurrency = await getPrimaryCurrencyAmount({ currencyCode: targetUser.userWallet.currencyCode, amount: addAmount, transaction })
      if (!conversionRate) rate = primaryCurrency.conversionRate

      let name = sourceUser.firstName
      if (sourceUser.lastName) name = name + ' ' + sourceUser.lastName

      role = ROLE.ADMIN
      id = sourceUser.adminUserId

      const transactionDetails = {
        actioneeType: role,
        actioneeId: id,
        actioneeEmail: sourceUser.email,
        actioneeName: name,
        targetId: targetUser.userId,
        walletId: targetUser.userWallet.walletId,
        amount: addAmount,
        currencyCode: targetUser.userWallet.currencyCode,
        countryCode: targetUser.countryCode,
        beforeBalance: balance,
        primaryCurrencyAmount: primaryCurrency.amount,
        conversionRate: rate,
        adminId: targetUser.parentId,
        amountType,
        transactionType,
        status,
        transactionDateTime: (new Date()).toISOString(),
        isSuccess,
        paymentTransactionId,
        isFirstDeposit: options?.isFirstDeposit
      }

      const transactionBanking = await db.TransactionBanking.create({ ...transactionDetails }, { transaction, options })

      return { err: null, success: true, transactionBanking }
    } catch (error) {
      return { err_type: 'Internal', err: error.message, success: false }
    }
  }
}
