export const dateOptions = [
  { labelKey: 'filter.date.today', code: 'IDLW', value: 'today' },
  { labelKey: 'filter.date.yesterday', code: 'IDLW', value: 'yesterday' },
  { labelKey: 'filter.date.monthtodate', code: 'IDLW', value: 'monthtodate' },
  { labelKey: 'filter.date.custom', code: 'IDLW', value: 'custom' },
  { labelKey: 'filter.date.last7days', code: 'IDLW', value: 'last7days' },
  { labelKey: 'filter.date.last30days', code: 'IDLW', value: 'last30days' },
  { labelKey: 'filter.date.last90days', code: 'IDLW', value: 'last90days' },
  { labelKey: 'filter.date.weektodate', code: 'IDLW', value: 'weektodate' },
  { labelKey: 'filter.date.yeartodate', code: 'IDLW', value: 'yeartodate' },
  {
    labelKey: 'filter.date.previousmonth',
    code: 'IDLW',
    value: 'previousmonth'
  },
  { labelKey: 'filter.date.previousyear', code: 'IDLW', value: 'previousyear' }
]

export const playerTypeOptions = [
  { labelKey: 'filter.playerType.all', code: 'IDLW', value: 'all' },
  { labelKey: 'filter.playerType.testPlayer', code: 'IDLW', value: 'internal' },
  { labelKey: 'filter.playerType.realPlayer', code: 'IDLW', value: 'real' }
]

export const hoursFilterOptions = [
  { labelKey: 'filter.playerType.oneHour', code: 'IDLW', value: '1 hour' },
  { labelKey: 'filter.playerType.twoHour', code: 'IDLW', value: '2 hour' },
  {
    labelKey: 'filter.playerType.twentyFourHour',
    code: 'IDLW',
    value: '24 hour'
  }
]

export const betDateOptions = [
  { labelKey: 'filter.date.custom', code: 'IDLW', value: 'custom' },
  { labelKey: 'filter.date.last7days', code: 'IDLW', value: 'last7days' },
  { labelKey: 'filter.date.last30days', code: 'IDLW', value: 'last30days' },
  { labelKey: 'filter.date.last90days', code: 'IDLW', value: 'last90days' },
  { labelKey: 'filter.date.weektodate', code: 'IDLW', value: 'weektodate' },
  { labelKey: 'filter.date.yeartodate', code: 'IDLW', value: 'yeartodate' },
  {
    labelKey: 'filter.date.previousmonth',
    code: 'IDLW',
    value: 'previousmonth'
  },
  { labelKey: 'filter.date.previousyear', code: 'IDLW', value: 'previousyear' }
]

export const loginKeys = {
  UNIQ_LOGIN: 'loginKeys.UNIQ_LOGIN',
  TOTAL_LOGIN: 'loginKeys.TOTAL_LOGIN'
}
export const customerDataKeysV2 = {
  NEW_REGISTRATION: 'customerDataKeysV2.NEW_REGISTRATION',
  PENDING_REDEMPTION_COUNT: 'Pending Redemption Count',
  FAILED_REDEMPTION_COUNT: 'Failed/Declined Redemption Count',
  PENDING_REDEMPTION_SUM: 'Pending Redemption Sum',
  FAILED_REDEMPTION_SUM: 'Failed/Declined Redemption Sum',
  FIRST_DEPOSIT_COUNT: 'customerDataKeysV2.FIRST_DEPOSIT_COUNT',
  FIRST_DEPOSIT_SUM: 'customerDataKeysV2.FIRST_DEPOSIT_SUM',
  PURCHASE_COUNT: 'customerDataKeysV2.PURCHASE_COUNT',
  PURCHASE_SUM: 'customerDataKeysV2.PURCHASE_SUM',
  AVERAGE_PURCHASE_AMOUNT: 'customerDataKeysV2.AVERAGE_PURCHASE_AMOUNT',
  REQUESTED_REDEMPTION_COUNT: 'customerDataKeysV2.REQUESTED_REDEMPTION_COUNT',
  APPROVAL_REDEMPTION_COUNT: 'customerDataKeysV2.APPROVAL_REDEMPTION_COUNT',
  CANCELLED_REDEMPTION_COUNT: 'customerDataKeysV2.CANCELLED_REDEMPTION_COUNT',
  REQUESTED_REDEMPTION_SUM: 'customerDataKeysV2.REQUESTED_REDEMPTION_SUM',
  APPROVAL_REDEMPTION_SUM: 'customerDataKeysV2.APPROVAL_REDEMPTION_SUM',
  CANCELLED_REDEMPTION_SUM: 'customerDataKeysV2.CANCELLED_REDEMPTION_SUM',
  NET_REVENUE: 'customerDataKeysV2.NET_REVENUE'
}
export const customerDataKeysInternal = {
  FIRST_DEPOSIT: 'customerDataKeysInternal.FIRST_DEPOSIT',
  FIRST_DEPOSIT_AMOUNT_SUM: 'customerDataKeysInternal.FIRST_DEPOSIT_AMOUNT_SUM',
  PURCHASE_AMOUNT_SUM: 'customerDataKeysInternal.PURCHASE_AMOUNT_SUM',
  PURCHASE_AMOUNT_COUNT: 'customerDataKeysInternal.PURCHASE_AMOUNT_COUNT',
  AVERAGE_PURCHASE_AMOUNT: 'customerDataKeysInternal.AVERAGE_PURCHASE_AMOUNT'
}
export const customerDataKeys = {
  NEW_REGISTRATION: 'customerDataKeys.NEW_REGISTRATION',
  PHONE_VERIFIED: 'customerDataKeys.PHONE_VERIFIED',
  FIRST_DEPOSIT: 'customerDataKeys.FIRST_DEPOSIT',
  FIRST_DEPOSIT_AMOUNT_SUM: 'customerDataKeys.FIRST_DEPOSIT_AMOUNT_SUM',
  PURCHASE_AMOUNT_SUM: 'customerDataKeys.PURCHASE_AMOUNT_SUM',
  PURCHASE_AMOUNT_COUNT: 'customerDataKeys.PURCHASE_AMOUNT_COUNT',
  AVERAGE_PURCHASE_AMOUNT: 'customerDataKeys.AVERAGE_PURCHASE_AMOUNT',
  APPROVAL_REDEMPTION_AMOUNT_SUM:
    'customerDataKeys.APPROVAL_REDEMPTION_AMOUNT_SUM',
  REQUEST_REDEMPTION_AMOUNT_SUM:
    'customerDataKeys.REQUEST_REDEMPTION_AMOUNT_SUM',
  REQUEST_REDEMPTION_COUNT_SUM: 'customerDataKeys.REQUEST_REDEMPTION_COUNT_SUM',
  PENDING_REDEMPTION_COUNT_SUM: 'customerDataKeys.PENDING_REDEMPTION_COUNT_SUM',
  GROSS_REVENUE: 'customerDataKeys.GROSS_REVENUE'
}

export const transactionDataKeys = {
  JACKPOT_REVENUE: 'Jackpot Revenue',
  ACTIVE_GC_PLAYER: 'transactionDataKeys.ACTIVE_GC_PLAYER',
  ACTIVE_SC_PLAYER: 'transactionDataKeys.ACTIVE_SC_PLAYER',
  SC_STAKED_TOTAL: 'transactionDataKeys.SC_STAKED_TOTAL',
  SC_WIN_TOTAL: 'transactionDataKeys.SC_WIN_TOTAL',
  SC_GGR_TOTAL: 'transactionDataKeys.SC_GGR_TOTAL',
  SC_NEW_ACTIVE_PLAYER: 'New Active SC Player',
  RETURN_TO_PLAYER: 'transactionDataKeys.RETURN_TO_PLAYER',
  HOUSE_EDGE: 'transactionDataKeys.HOUSE_EDGE'
}

export const coinEcoDataKeys = {
  GC_CREDITED_PURCHASE: 'coinEcoDataKeys.GC_CREDITED_PURCHASE',
  SC_CREDITED_PURCHASE: 'coinEcoDataKeys.SC_CREDITED_PURCHASE',
  GC_AWARDED_TOTAL: 'coinEcoDataKeys.GC_AWARDED_TOTAL',
  SC_AWARDED_TOTAL: 'coinEcoDataKeys.SC_AWARDED_TOTAL',
  SC_TOTAL_BALANCE: 'coinEcoDataKeys.SC_TOTAL_BALANCE',
  USC_BALANCE: 'coinEcoDataKeys.USC_BALANCE',
  RSC_BALANCE: 'coinEcoDataKeys.RSC_BALANCE'
}

export const tableData = [
  'TODAY',
  'YESTERDAY',
  'MONTH_TO_DATE',
  'LAST_MONTH',
  'TILL_DATE',
  'CUSTOM'
]
export const bonusDataKeys = {
  AMOE_BONUS: 'AMOE Bonus',
  TIER_BONUS: 'Tier Bonus',
  DAILY_BONUS: 'Daily Bonus',
  PACKAGE_BONUS: 'Package Bonus',
  RAFFLE_PAYOUT: 'Raffle Payout',
  WELCOME_BONUS: 'Welcome Bonus',
  JACKPOT_WINNER: 'Jackpot Winner',
  PERSONAL_BONUS: 'Personal Bonus',
  PROVIDER_BONUS: 'Provider Bonus',
  REFERRAL_BONUS: 'Referral Bonus',
  AFFILIATE_BONUS: 'Affiliate Bonus',
  PROMOTION_BONUS: 'CRM Promo Bonus',
  WHEELSPIN_BONUS: 'Wheelspin Bonus',
  WEEKLYTIER_BONUS: 'Weekly Tier Bonus',
  MONTHLYTIER_BONUS: 'Monthly Tier Bonus',
  SCRATCHCARD_BONUS: 'Scratch Card Bonus',
  TOURNAMENT_WINNER: 'Tournament Winner',
  ADDED_ADMIN_SCBONUS: 'Admin Added SC Bonus',
  CRM_PROMOCODE_BONUS: 'CRM Purchase Promocode Bonus',
  FIRST_PURCHASE_BONUS: 'First Purchase Bonus',
  PURCHASE_PROMOCODE_BONUS: 'Purchase Promocode Bonus',
  TOTAL: 'Sum of All Bonuses'
}

export const totalTablesList = {
  loginData: loginKeys,
  customerDataKeys: customerDataKeys,
  customerDataKeysV2: customerDataKeysV2,
  customerDataKeysInternal: customerDataKeysInternal,
  transactionDataKeys: transactionDataKeys,
  coinEcoDataKeys: coinEcoDataKeys,
  bonusDataKeys: bonusDataKeys
}

export const originalObject = {
  UNIQ_LOGIN: {
    TODAY: 10,
    YESTERDAY: 20,
    MONTH_TO_DATE: 15,
    LAST_MONTH: 12,
    CUSTOM: 30
  },
  TOTAL_LOGIN: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 1,
    LAST_MONTH: 0,
    CUSTOM: 1
  },
  NEW_REGISTRATION: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 2,
    LAST_MONTH: 0,
    CUSTOM: 2
  },
  PHONE_VERIFIED: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  FIRST_DEPOSIT: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  FIRST_DEPOSIT_AMOUNT_SUM: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  PURCHASE_AMOUNT_SUM: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  PURCHASE_AMOUNT_COUNT: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  APPROVAL_REDEMPTION_AMOUNT_SUM: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  REQUEST_REDEMPTION_AMOUNT_SUM: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  REQUEST_REDEMPTION_COUNT_SUM: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  PENDING_REDEMPTION_COUNT_SUM: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  GROSS_REVENUE: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  ACTIVE_GC_PLAYER: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  ACTIVE_SC_PLAYER: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  SC_STAKED_TOTAL: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  SC_WIN_TOTAL: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  SC_GGR_TOTAL: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  RETURN_TO_PLAYER: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  HOUSE_EDGE: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },

  SC_NEW_ACTIVE_PLAYER: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  GC_CREDITED_PURCHASE: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  SC_CREDITED_PURCHASE: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  GC_AWARDED_TOTAL: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  SC_AWARDED_TOTAL: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: null,
    LAST_MONTH: null,
    CUSTOM: null
  },
  SC_TOTAL_BALANCE: {
    TODAY: null,
    YESTERDAY: null,
    MONTH_TO_DATE: '0',
    LAST_MONTH: '0',
    CUSTOM: '0'
  },
  USC_BALANCE: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  },
  RSC_BALANCE: {
    TODAY: 0,
    YESTERDAY: 0,
    MONTH_TO_DATE: 0,
    LAST_MONTH: 0,
    CUSTOM: 0
  }
}

export const customerDashboardOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Customers Data Bar Chart'
    }
  },
  barPercentage: 0.6
}

export const customerLabelsShortKey = [
  'NR',
  'PV',
  'FD',
  'FDAS',
  'PAS',
  'PAC',
  'ARAS',
  'RRAS',
  'PRCS'
]

// export const customerDashboardColors = [
//   'rgba(255, 99, 132, 0.5)',
//   'rgba(53, 162, 235, 0.5)',
//   'rgba(245, 77, 61, 0.5)',
//   'rgba(220, 174, 150, 0.5)',
//   'rgba(47, 80, 97, 0.5)',
// ];
export const customerDashboardColors = [
  'rgb(255,255,204)',
  'rgb(194,230,153)',
  'rgb(120,198,121)',
  'rgb(49,163,84)',
  'rgb(0,104,55)'
]

export const timeZones = [
  { labelKey: 'International Date Line West', code: 'IDLW', value: '-12:00' }, // International Date Line West
  { labelKey: 'Nome Time', code: 'NT', value: '-11:00' }, // Nome Time
  { labelKey: 'Hawaii Standard Time', code: 'HST', value: '-10:00' }, // Hawaii Standard Time
  { labelKey: 'Alaska Standard Time', code: 'AKST', value: '-09:00' }, // Alaska Standard Time
  { labelKey: 'Pacific Standard Time', code: 'PST', value: '-08:00' }, // Pacific Standard Time
  { labelKey: 'Mountain Standard Time', code: 'MST', value: '-07:00' }, // Mountain Standard Time
  { labelKey: 'Central Standard Time', code: 'CST', value: '-06:00' }, // Central Standard Time
  { labelKey: 'Eastern Standard Time', code: 'EST', value: '-05:00' }, // Eastern Standard Time
  { labelKey: 'Atlantic Standard Time', code: 'AST', value: '-04:00' }, // Atlantic Standard Time
  { labelKey: 'Newfoundland Standard Time', code: 'NST', value: '-03:30' }, // Newfoundland Standard Time
  { labelKey: 'Brasília Time', code: 'BRT', value: '-03:00' }, // Brasília Time
  {
    labelKey: 'South Georgia and the South Sandwich Islands Time',
    code: 'GST-2',
    value: '-02:00'
  }, // South Georgia and the South Sandwich Islands Time
  { labelKey: 'Azores Standard Time', code: 'AZOT', value: '-01:00' }, // Azores Standard Time
  { labelKey: 'Greenwich Mean Time', code: 'GMT', value: '+00:00' }, // Greenwich Mean Time
  { labelKey: 'Central European Time', code: 'CET', value: '+01:00' }, // Central European Time
  { labelKey: 'Eastern European Time', code: 'EET', value: '+02:00' }, // Eastern European Time
  { labelKey: 'Moscow Standard Time', code: 'MSK', value: '+03:00' }, // Moscow Standard Time
  { labelKey: 'Iran Standard Time', code: 'IRST', value: '+03:30' }, // Iran Standard Time
  { labelKey: 'Gulf Standard Time', code: 'GST', value: '+04:00' }, // Gulf Standard Time
  { labelKey: 'Indian Standard Time', code: 'IST', value: '+05:30' }, // Indian Standard Time
  { labelKey: 'Bangladesh Standard Time', code: 'BST', value: '+06:00' }, // Bangladesh Standard Time
  { labelKey: 'Indochina Time', code: 'ICT', value: '+07:00' }, // Indochina Time
  { labelKey: 'China Standard Time', code: 'CST+8', value: '+08:00' }, // China Standard Time
  { labelKey: 'Japan Standard Time', code: 'JST', value: '+09:00' }, // Japan Standard Time
  {
    labelKey: 'Australian Central Standard Time',
    code: 'ACST',
    value: '+09:30'
  }, // Australian Central Standard Time
  {
    labelKey: 'Australian Eastern Standard Time',
    code: 'AEST',
    value: '+10:00'
  }, // Australian Eastern Standard Time
  { labelKey: 'Solomon Islands Time', code: 'SBT', value: '+11:00' }, // Solomon Islands Time
  { labelKey: 'New Zealand Standard Time', code: 'NZST', value: '+12:00' }, // New Zealand Standard Time
  { labelKey: 'New Zealand Daylight Time', code: 'NZDT', value: '+13:00' }, // New Zealand Daylight Time
  { labelKey: 'Line Islands Time', code: 'LINT', value: '+14:00' } // Line Islands Time
]
