export const STATUS = {
  NONE: 'none',
  SHORT: 'short',
  HOLD: 'hold',
  GOOD: 'good',
  INVALID: 'invalid',
  NEW: 'new',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  UNPAID: 'unpaid',
  PAID: 'paid',
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed',
  DONE: 'done'
}

export const EVENT_TYPE = {
  PAYMENT: 'payment',
  PAYOUT: 'payout',
  WITHDRAW: 'withdraw',
  TRANSACTION_STATUS: 'transaction.status'
}

export const TRANSACTION_PROVIDER = {
  PAYSAFE: 'PAYSAFE',
  PAY_BY_BANK: 'PAY_BY_BANK',
  SKRILL: 'SKRILL',
  TRUSTLY: 'TRUSTLY'
}
