export const reasonOptions = [
  'Image Not Visible Properly',
  'Not A Valid Document',
  'Document Validation Expired',
  'Add Custom Reason'
]

export const tableHeaders = [
  { label: 'Id', value: 'userBonusId' },
  { label: 'Promotion Title', value: 'promotionTitle' },
  { label: 'Bonus Type', value: 'bonusType' },
  { label: 'Valid Till', value: 'validTo' },
  { label: 'Is Expired', value: 'isExpired' },
  { label: 'Status', value: 'isActive' },
  { label: 'Cancelled By', value: 'cancelledBy' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Action', value: 'action' }
]

export const bonusStatus = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Forfeited', value: 'FORFEITED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Completed', value: 'COMPLETED' }
]

export const bonusTypes = [
  { label: 'All', value: '' },
  { label: 'DEPOSIT', value: 'deposit', id: 0 },
  { label: 'JOINING', value: 'joining', id: 1 },
  { label: 'FREESPINS', value: 'freespins', id: 2 }
]

export const kycStatusOption = [
  { label: 'All', value: 'ALL' },
  { label: 'Init', value: 'INIT' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On Hold', value: 'ONHOLD' },
]

export const coinTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'GC', value: 0 },
  { label: 'SC', value: 1 },
]

export const actionTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Bet', value: 'bet' },
  { label: 'Win', value: 'win' },
  { label: 'Lost', value: 'lost' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Tournament', value: 'tournament' },
  // { label: 'Pre Rollback', value: 'rollbackbeforebetwin' },
]

export const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Rollback', value: 'rollback' },
]

export const transactionTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Purchase', value: 'deposit' },
  { label: 'Redeem', value: 'redeem' },
  { label: 'AddSc', value: 'addSc' },
  { label: 'AddGc', value: 'addGc' },
  { label: 'RemoveSc', value: 'removeSc' },
  { label: 'RemoveGc', value: 'removeGc' },
  { label: 'Vault Deposit', value: 'vaultDeposit' },
  { label: 'Vault Withdraw', value: 'vaultWithdraw' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Vault Interest Credit', value: 'vaultInterestCredit' },
]

export const statusTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Success', value: 'success' },
  { label: 'Cancelled', value: 'canceled' },
  { label: 'Declined', value: 'declined' },
  { label: 'Failed', value: 'failed' },
  { label: 'InProgress', value: 'inprogress' },
]

export const activityTypeOptions = [
  { label: 'Redemptions', value: 'redemptions', id: 1 },
  { label: 'Login', value: 'login', id: 2 },
  { label: 'Registered Data', value: 'registeredData', id: 3 },
  { label: 'Purchase', value: 'purchase', id: 4 },
  { label: 'Wins', value: 'wins', id: 5 }
]

export const ruleActivityConstants = {
  1: 'Redemptions',
  2: 'Login',
  3: 'Registered Data',
  4: 'Purchase',
  5: 'Wins'
}

export const criteriaOptions = [
  { label: 'Country', value: 'country' },
  { label: 'Player Groups', value: 'playerGroups' }
]


export const PlayersTabInfo = {
  editParent: {
    label: 'Edit',
    key: 'editParent',
    childLabel: [
      {
        label: 'Ban/unban',
        key: 'isBan',
        type: 3
      },
      {
        label: 'Disable 2 FA',
        key: 'is2FaEnabled',
      },
      {
        label: 'Restrict',
        key: 'isRestrict',
        type: 2
      }, {
        label: 'Add/deduct coins',
        key: 'addDeductCoinsChild'
      },
      {
        label: 'Limits',
        key: 'limitsChild'
      },
      {
        label: 'Password',
        key: 'passwordChild'
      },
      {
        label: 'Remove PW Lock',
        key: 'removePwLock'
      },
      {
        label: 'Test account',
        key: 'isInternalUser',
        type: 4
      },
      {
        label: 'Force Logout',
        key: 'forceLogoutChild'
      },
      {
        label: 'User Verification',
        key: 'isUserVerified'
      },
      {
        label: 'Phone Verification',
        key: 'phoneVerified'
      },
      {
        label: 'Add 1 SC',
        key: 'addDeduct1ScCoinChild'
      },
      {
        label: 'Add 2 SC',
        key: 'addDeduct2ScCoinsChild'
      },
      {
        label: 'Canadian User',
        key: 'canadianUser'
      }
      // {
      //   label: 'Update Tier',
      //   key: 'updateTier'
      // },
      // {
      //   label: 'Promocode Ban/Unban',
      //   key: 'promocodeBan'
      // }
    ]
  },

  activityParent: {
    label: 'Activity',
    key: 'activityParent'
  },
}

// export const auditTableHeaders = ['BO Username', 'Field Changed', 'Original Value', 'Changed Value', 'source', 'Time', 'Remark']
// export const logsTableHeaders = ['Local Time', 'CET Time', 'Type', 'IP Address']
// export const commsTableHeaders = ['Id', 'Communication Date', 'Email Address', 'Template Id', 'Template Name', 'Message Id', 'Source', 'Details']
export const PlayerConsentHeader = ['Type', 'Version', 'Date Published', 'Status', 'Date Accepted']
export const PlayerLimitHeader = ['Limit Type', 'Value', 'Frequency', 'Set Date', 'Active From', 'Reset Date', 'Cooling Period', 'Status']
export const PlayerTABSEHeader = {
  TIME: ['Limit Type', 'Time Break', 'Frequency', 'Set Date', 'Active From', 'Reset Date', 'Cooling Period', 'Status'],
  TIME_BREAK: ['Set Date', 'Active From', 'Reset Date', 'Cooling Period', 'Status'],
  SESSION: ['Set Date', 'Active From', 'Reset Date', 'Cooling Period', 'Status'],
  SELF_EXCLUSION: ['Set Date', 'Active From', 'Reset Date', 'Cooling Period', 'Status'],
}
export const activityTableHeader = ['Game Id', 'Name', 'Provider', 'Start', 'End', 'Action Type', 'Amount $', 'GC', 'SC',
  'Transaction ID', 'Status', 'Is Success', 'Payment Transaction Id', 'Package Id', 'Action Id', 'Before Balance', 'After Balance', 'Round Id', 'Tournament Id', 'Action']

export const RSGStatus = {
  0: 'In-Active',
  1: 'Active',
  2: 'Cooling Period'
}

export const RSGLimitType = {
  1: 'Daily',
  2: 'Weekly',
  3: 'Monthly'
}

export const activityConstants = [
  { label: 'All', value: 'all' },
  { label: 'All Purchases', value: 'AP' },
  { label: 'Purchase ACH', value: 'PACH' },
  // { label: 'Purchase credit cards', value: 'all' },
  { label: 'All redemptions', value: 'redeem' },
  { label: 'All manual credits', value: 'All manual credits' },
  { label: 'Manually added GC', value: 'Manually added GC' },
  { label: 'Manually added SC', value: 'Manually added SC' },
  { label: 'Manually deducted GC', value: 'Manually deducted GC' },
  { label: 'Manually deducted SC', value: 'Manually deducted SC' },
  // { label: 'Manually added bonus', value: 'all' },
  // { label: 'Manually added missing purchase', value: 'all' },
  // { label: 'Manually added Good Will', value: 'all' },
  { label: 'All manual deductions', value: 'All manual deductions' },
  // { label: 'All stakes', value: 'all' },
  // { label: 'Stake Gold Coins', value: 'all' },
  // { label: 'All promotions', value: 'all' },
  // { label: 'Free spins bonus', value: 'all' },
  { label: 'Daily bonus', value: 'Daily bonus' },
  { label: 'Welcome bonus', value: 'Welcome bonus' },
  { label: 'AMOE', value: 'AMOE' },
]

export const statusConstants = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'Success' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Declined', value: 'Declined' },
  { label: 'Void', value: 'Void' },
  { label: 'Refund', value: 'Refund' },

]

export const docsConstants = [
  { label: 'Address Proof', value: 'address' },
  { label: 'Id Proof', value: 'id' },
  { label: 'Bank Statement', value: 'bank_checking' },
  { label: 'SSN Document', value: 'ssn' },
  { label: 'Other', value: 'other' },
]

export const SIGN_UP_METHOD = {
  0: 'Email',
  1: 'Google',
  2: 'Facebook'
}

export const VERIFFSTATUS = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELED',
  COMPLETED: 'COMPLETED'
}

export const kycConstants = [
  { label: 'VL1', value: 'K1' },
  { label: 'VL2', value: 'K2' },
  { label: 'VL3', value: 'K3' },
  { label: 'VL4', value: 'K4' },
]

export const actionConstants = [
  { label: 'All', value: 'all' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'SC by Admin', value: 'addSc' },
  { label: 'GC by Admin', value: 'addGc' },
  { label: 'Purchase', value: 'deposit' },
  { label: 'Redeem', value: 'redeem' },
  { label: 'Welcome Bonus', value: "welcome bonus" },
  { label: 'Daily Bonus', value: "daily-bonus" },
  { label: 'Referral Bonus', value: "referral-bonus" },
  { label: 'Personal Bonus', value: "personal-bonus" },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Vault Interest Credit', value: 'vaultInterestCredit' },
]

export const transactionConstants = [
  { label: 'All', value: 'all' },
  { label: 'Banking', value: 'banking' },
  { label: 'Casino', value: 'casino' },
]

export const TRANSACTION_STATUS = {
  0: 'Pending',
  1: 'Success',
  2: 'Cancelled',
  3: 'Failed',
  4: 'Rollback',
  5: 'Approved',
  6: 'Declined',
  7: 'inprogress',
  8: 'postpone',
  9: 'Void',
  10: 'Refund'
}