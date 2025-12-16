export const tableHeaders = (isAllUser) => [
    { labelKey: 'transactions.headers.id', value: '' },
   // { labelKey: 'transactions.headers.paymentId', value: 'paymentId' },
   { labelKey: 'User Id', value: 'userId' },
    { labelKey: isAllUser ? 'transactions.headers.email' : 'transactions.headers.actioneeName', value: '' },
    // { labelKey: 'transactions.headers.actionType', value: 'scCoin' },
    { labelKey: 'transactions.headers.amount', value: 'amount' },
    { labelKey: 'transactions.headers.gcCoin', value: 'gcCoin' },
    { labelKey: 'transactions.headers.scCoin', value: 'scCoin' },
    { labelKey: 'transactions.headers.transactionType', value: '' },
    { labelKey: 'transactions.headers.status', value: 'status'},
    { labelKey: 'transactions.headers.createdAt', value: 'createdAt' },
    { labelKey: 'transactions.headers.action', value: '' },

]

export const TRANSACTION_STATUS = {
    '-1': 'Initiated',
    0: 'Pending',
    1: 'Success',
    2: 'Cancelled',
    3: 'Failed',
    4: 'Rollback',
    5: 'Approved',
    6: 'Declined',
    7: 'In-progress',
    9: 'Void',
    10: 'Refund'
  }