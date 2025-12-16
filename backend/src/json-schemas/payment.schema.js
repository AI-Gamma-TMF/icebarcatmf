import ajv from '../libs/ajv'

const paymentTransactionSchema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: [
        'pending',
        'success',
        'canceled',
        'failed',
        'declined',
        'inprogress',
        'all',
        'initiated'
      ]
    },
    transactionType: {
      type: ['string', 'null'],
      enum: [
        'deposit',
        'withdraw',
        'addSc',
        'addGc',
        'removeSc',
        'removeGc',
        'vaultDeposit',
        'vaultWithdraw',
        'subscription',
        'vaultInterestCredit',
        'all'
      ]
    },
    timezone: { type: 'string' },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'false'] }
  }
}
ajv.addSchema(paymentTransactionSchema, '/payment-transaction.json')

const redeemRequestsSchema = {
  type: 'object',
  properties: {
    pageNo: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    transactionId: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'], enum: ['userId', 'status', 'withdrawRequestId', 'transactionId', 'email', 'cancelRedemptionCount', 'lastWithdrawalDate', 'zipCode', 'paymentProvider', 'NGR', 'playThrough'] },
    sortBy: { type: ['string', 'null'], enum: ['ASC', 'DESC', 'asc', 'desc'] },
    email: { type: ['string', 'null'] },
    status: { type: ['string', 'null'], enum: ['pending', 'success', 'failed', 'canceled', 'declined', 'inprogress', 'all'] },
    userId: { type: ['string', 'null'] },
    csvDownload: { type: 'string', enum: ['true', 'false'] },
    operator: { type: ['string', 'null'], enum: ['<=', '>=', '>', '<', '='] },
    filterBy: { type: ['string', 'null'], enum: ['NGR', 'playThrough', 'amount', 'last30daysRollingRedeemAmount'] },
    value: { type: ['string', 'null'], pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
    timezone: { type: 'string' },
    paymentProvider: { type: ['string', 'null'], enum: ['PAY_BY_BANK', 'TRUSTLY', 'SKRILL', 'all'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] }
  }
}

ajv.addSchema(redeemRequestsSchema, '/redeem-transaction.json')

const redeemRequestsActionSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['approved', 'rejected']
    },
    withdrawRequestId: { type: ['string', 'null'] },
    transactionId: { type: ['string', 'null'] },
    userId: { type: 'number' },
    reason: { type: ['string', 'null'] }
  },
  required: ['status', 'userId']
}

ajv.addSchema(redeemRequestsActionSchema, '/redeem-request-action.json')

const refundPurchaseSchema = {
  type: 'object',
  properties: {
    reason: { type: 'string' },
    userId: { type: 'number' },
    transactionBankingId: { type: ['number', 'null'] },
    paymentTransactionId: { type: 'string' }
  },
  required: ['userId', 'paymentTransactionId', 'reason']
}

ajv.addSchema(refundPurchaseSchema, '/refund-purchase.json')

const getUsersWithVaultCoinsValidationSchema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    username: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'false'] },
    vaultGcCoin: { type: ['string', 'null'] },
    vaultScCoin: { type: ['string', 'null'] },
    filterBy: { type: ['string', 'null'] },
    operator: { type: ['string', 'null'] },
    value: { type: ['string', 'null'] }
  },
  required: []
}

ajv.addSchema(getUsersWithVaultCoinsValidationSchema, '/get-users-with-vault-coins.json')
