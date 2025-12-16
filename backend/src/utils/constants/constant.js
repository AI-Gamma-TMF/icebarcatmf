export const RESPONSIBLE_GAMING_ENDPOINTS = [
  'set-daily-limit',
  'set-loss-limit',
  'set-deposit-limit',
  'set-disable-until',
  'set-session-time'
]
export const REPORT_ENDPOINTS = ['report']

export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  USER: 'user'
}

export const TICKET_TYPE = {
  REDEMPTION: '1',
  EXPIRY: '2',
  FRAUD: '3',
  VERIFICATION: '4'
}

export const TICKET_STATUS = {
  UNASSIGNED: '0',
  PENDING: '1',
  SUCCESS: '2'
}

export const ROLE_ID = {
  ADMIN: 1,
  MANAGER: 2,
  SUPPORT: 3,
  USER: 4
}
export const ROLE_MAP = {
  [ROLE_ID.ADMIN]: ROLE.ADMIN,
  [ROLE_ID.MANAGER]: ROLE.MANAGER,
  [ROLE_ID.SUPPORT]: ROLE.SUPPORT,
  [ROLE_ID.USER]: ROLE.USER
}

export const EmailTemplateJobStatus = {
  complete: 3,
  inprogress: 2,
  initiate: 1,
  fail: 4
}

export const BREAK_TYPE = {
  TAKE_A_BREAK: 'TAKE_A_BREAK',
  SELF_EXCLUSION: 'SELF_EXCLUSION'
}

export const SELF_EXCLUSION_TYPE = {
  CURRENT: 'current',
  ALL: 'all'
}

export const REQUEST_TYPE = {
  GET: 'R',
  POST: 'C',
  PUT: 'U',
  DELETE: 'D',
  TOGGLE: 'T',
  APPLY_THEME: 'A',
  CREATE_CUSTOM: 'CC',
  ADD_BALANCE: 'AB',
  SET_RESET: 'SR',
  TEST_EMAIL: 'TE',
  BONUS: 'Issue',
  DASHBOARD_REPORT: 'DR',
  PATCH: 'T'
}

export const PERMISSION_TYPE = {
  Package: 'Package',
  Dashboard: 'Dashboard',
  Admins: 'Admins',
  CMS: 'CMS',
  Credentials: 'Credentials',
  Users: 'Users',
  Transactions: 'Transactions',
  Bonus: 'Bonus',
  WageringTemplate: 'WageringTemplate',
  RestrictedCountry: 'RestrictedCountry',
  CasinoManagement: 'CasinoManagement',
  LivePlayerReport: 'LivePlayerReport',
  PlayerStatisticsReport: 'PlayerManagementReport',
  PlayerLiabilityReport: 'PlayerLiabilityReport',
  KpiSummaryReport: 'KpiSummaryReport',
  KpiReport: 'KpiReport',
  GameReport: 'GameReport',
  Settings: 'Settings',
  // Affiliates: 'Affiliates',
  Tournaments: 'Tournaments',
  Tiers: 'Tiers',
  Raffles: 'Raffles',
  RafflePayout: 'RafflePayout',
  WalletCoin: 'WalletCoin',
  BlockUsers: 'BlockUsers',
  ExportCenter: 'ExportCenter',
  DomainBlock: 'DomainBlock',
  emailCenter: 'emailCenter',
  AdminAddedCoins: 'AdminAddedCoins',
  VipManagement: 'VipManagement',
  Jackpot: 'Jackpot',
  VipManagedBy: 'VipManagedBy',
  PromotionThumbnail: 'PromotionThumbnail',
  GamePages: 'GamePages',
  Calender: 'Calender',
  Subscription: 'Subscription',
  ProviderDashboard: 'ProviderDashboard',
  aliases: {
    // Admins
    admin: 'Admins',
    bonus: 'Bonus',
    create: 'Admins',
    update: 'Admins',
    lists: 'Admins',
    cms: 'CMS',
    user: 'Users',
    SITE: 'Site',
    ADMIN: 'Admins',
    USER: 'Users',
    CMS: 'CMS',
    email: 'EmailTemplate',
    BONUS: 'Bonus',
    package: 'Package',
    country: 'RestrictedCountry',
    CASINOMANAGEMENT: 'CasinoManagement',
    banner: 'Banner',
    casino: 'CasinoManagement',
    payment: 'Transactions',
    report: 'Report',
    alert: 'Alert',
    // affiliate: 'Affiliates',
    tournament: 'Tournaments',
    raffle: 'Raffles',
    rafflePayout: 'RafflePayout',
    'postal-code': 'PostalCode',
    tier: 'Tiers',
    promotion: 'PromotionBonus',
    'anti-fraud': 'FraudUser',
    walletCoin: 'WalletCoin',
    promocode: 'Promocode',
    'crm-promotion': 'CrmPromotion',
    exportCenter: 'ExportCenter',
    domainBlock: 'DomainBlock',
    blockUsers: 'BlockUsers',
    'email-center': 'emailCenter',
    amoe: 'Amoe',
    'admin-notification-center': 'NotificationCenter',
    'admin-credit': 'AdminAddedCoins',
    'maintenance-mode': 'MaintenanceMode',
    vip: 'VipManagement',
    'cashier-management': 'CashierManagement',
    'blog-post': 'BlogPost',
    gallery: 'Gallery',
    jackpot: 'Jackpot',
    'vip-managed-by': 'VipManagedBy',
    'promotion-thumbnail': 'PromotionThumbnail',
    'game-pages': 'GamePages',
    calender: 'Calender',
    subscription: 'Subscription',
    'provider-dashboard': 'ProviderDashboard'
  }
}

export const TEST_EMAIL = 'test-email-template'
export const MANAGE_MONEY = 'add-balance'

// T here is Toggle Status, SR here is set reset Responsible gaming limits, AB: add balance
export const ADMIN_PERMISSION = {
  Package: ['C', 'R', 'U', 'D'],
  Admins: ['C', 'R', 'U', 'T', 'D'],
  CMS: ['C', 'R', 'U', 'T', 'D'],
  Users: ['C', 'R', 'U', 'T', 'D'],
  Transactions: ['C', 'R', 'U', 'T', 'D'],
  Bonus: ['C', 'R', 'U', 'T', 'Issue', 'D'],
  CasinoManagement: ['C', 'R', 'U', 'T', 'D'],
  Banner: ['C', 'R', 'U', 'T', 'D'],
  Report: ['R', 'DR'],
  Configurations: ['C', 'R', 'U', 'T', 'D'],
  Tournaments: ['C', 'R', 'U', 'T', 'D'],
  Tiers: ['C', 'R', 'U', 'T', 'D'],
  Raffles: ['C', 'R', 'U', 'T', 'D'],
  RafflePayout: ['C', 'R', 'U', 'T', 'D'],
  PromotionBonus: ['C', 'R', 'U', 'T', 'D'],
  WalletCoin: ['C', 'R', 'U', 'D'],
  FraudUser: ['R'],
  Promocode: ['C', 'R', 'U', 'T', 'D'],
  PostalCode: ['C', 'R', 'U', 'D'],
  CrmPromotion: ['C', 'R', 'U', 'T', 'D'],
  ExportCenter: ['C', 'R', 'U', 'T', 'D'],
  DomainBlock: ['C', 'R', 'U', 'T', 'D'],
  BlockUsers: ['C', 'R', 'U', 'T', 'D'],
  emailCenter: ['C', 'R', 'U', 'T', 'D'],
  Amoe: ['C', 'R', 'U', 'D'],
  NotificationCenter: ['C', 'R', 'U', 'D'],
  AdminAddedCoins: ['C', 'R', 'U', 'D'],
  MaintenanceMode: ['C', 'R', 'U', 'D', 'T'],
  VipManagement: ['C', 'R', 'U', 'D', 'T', 'CR'],
  CashierManagement: ['C', 'R', 'U', 'T', 'D'],
  BlogPost: ['C', 'R', 'U', 'T', 'D'],
  Gallery: ['C', 'R', 'D'],
  Jackpot: ['C', 'R', 'U', 'D'],
  VipManagedBy: ['R', 'U'],
  PromotionThumbnail: ['C', 'R', 'U', 'D', 'T'],
  ScratchCardConfiguration: ['C', 'R', 'U', 'T', 'D'],
  GamePages: ['C', 'R', 'U', 'T', 'D'],
  Calender: ['C', 'R', 'U', 'T', 'D'],
  Subscription: ['C', 'R', 'U', 'T', 'D'],
  ProviderDashboard: ['C', 'R', 'U', 'T', 'D']
}

export const TOGGLE_CASE = {
  ADMIN: 'ADMIN',
  SITE: 'SITE',
  AFFILIATE: 'AFFILIATE',
  USER: 'USER',
  USER_EMAIL: 'USER-EMAIL',
  CMS: 'CMS',
  CASINO_CATEGORY: 'CASINO_CATEGORY',
  CASINO_SUB_CATEGORY: 'CASINO_SUB_CATEGORY',
  CATEGORY_GAME: 'CATEGORY_GAME',
  CASINO_GAME: 'CASINO_GAME',
  CASINO_PROVIDER: 'CASINO_PROVIDER',
  AGGREGATOR: 'AGGREGATOR',
  BONUS: 'BONUS',
  LANGUAGE: 'LANGUAGE',
  BANNER: 'BANNER',
  FREE_SPIN_GAME: 'FREE_SPIN_GAME',
  FREE_SPIN_PROVIDER: 'FREE_SPIN_PROVIDER',
  FREE_SPIN_AGGREGATOR: 'FREE_SPIN_AGGREGATOR'
}

export const CASINO_TOGGLE_CASE = [
  'CMS',
  'Package',
  'CATEGORY_GAME',
  'CASINO_CATEGORY',
  'CASINO_SUB_CATEGORY',
  'CASINO_GAME',
  'CASINO_PROVIDER',
  'AGGREGATOR',
  'BANNER',
  'FREE_SPIN_GAME',
  'FREE_SPIN_PROVIDER',
  'FREE_SPIN_AGGREGATOR'
]

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4,
  ON_HOLD: 5
}

export const STATUS_VALUE = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  DECLINE: 'DECLINED',
  FAILED: 'FAIL',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELED'
}

export const UPLOAD_FILE_SIZE = 5000000
export const OK = 'ok'

export const TYPE = {
  CRYPTO: 'CRYPTO',
  FIAT: 'FIAT',
  CRYPTO_ID: 0,
  FIAT_ID: 1
}

export const THUMBNAIL_TYPE = {
  MOBILE: 'mobile',
  SHORT: 'short',
  LONG: 'long',
  PROVIDER_IMG: 'provider_img'
}
export const TRANSACTION_STATUS = {
  INITIATED: -1,
  PENDING: 0,
  SUCCESS: 1,
  CANCELED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  DECLINED: 6,
  INPROGRESS: 7,
  SCHEDULED: 8,
  VOID: 9,
  REFUND: 10
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'redeem',
  BONUS: 'bonus',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney',
  ADD_SC: 'addSc',
  ADD_GC: 'addGc',
  REMOVE_SC: 'removeSc',
  REMOVE_GC: 'removeGc'
}

export const GAME_CATEGORY = {
  TABLE_GAME: 'table',
  CASINO_GAME: 'casino'
}

export const RESTRICTED_TYPE = {
  PROVIDERS: 'PROVIDERS',
  GAMES: 'GAMES'
}

export const EMAIL_SUBJECTS = {
  verification: 'Successful Identity Verification',
  withdrawApproved: 'Redemption Request Approved',
  verificationRequested: 'Identity Verification Requested'
}

export const ACTION = {
  WIN: 'win',
  BET: 'bet',
  ROLLBACK: 'rollback',
  ROLLBACKBEFOREBETWIN: 'prerollback',
  FREESPINS: 'freespins',
  LOST: 'lost',
  BONUS: 'bonus',
  TOURNAMENT: 'tournament',
  SC_DEDUCT: 'scDeduct',
  GC_DEDUCT: 'gcDeduct',
  SC_CREDIT: 'scCredit',
  GC_CREDIT: 'gcCredit'
}

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3
}

export const AMOUNT_TYPE = {
  GC_COIN: 0,
  SC_COIN: 1,
  SC_GC_COIN: 2
}

export const COIN_TYPE = {
  SC: 1,
  GC: 0,
  SC_GC: 2
}

export const BONUS_TYPE = {
  DAILY_BONUS: 'daily-bonus',
  WELCOME_BONUS: 'welcome bonus',
  REFERRAL_BONUS: 'referral-bonus',
  PERSONAL_BONUS: 'personal-bonus',
  RAFFLE_PAYOUT: 'raffle-payout',
  TIER_BONUS: 'tier-bonus',
  MONTHLY_TIER_BONUS: 'monthly-tier-bonus',
  WEEKLY_TIER_BONUS: 'weekly-tier-bonus',
  PROMOTION_BONUS: 'promotion-bonus',
  AFFILIATE_BONUS: 'affiliate-bonus',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  WHEEL_SPIN_BONUS: 'wheel-spin-bonus',
  PACKAGE_BONUS: 'package-bonus',
  POSTAL_CODE_BONUS: 'postal-code-bonus',
  GC_BONUS: 'gc-bonus',
  TOURNAMENT_BONUS: 'tournament',
  PROVIDER_BONUS: 'provider-bonus',
  AMOE_BONUS: 'amoe-bonus',
  FREE_SPIN_BONUS: 'free-spin-bonus',
  VIP_QUESTIONNAIRE_BONUS: 'vip-questionnaire-bonus',
  JACKPOT_WINNER: 'jackpotWinner',
  SCRATCH_CARD_BONUS: 'scratch-card-bonus',
  SUBSCRIPTION_RETENTION_BONUS: 'subscription-retention-bonus'
}

export const WAGERING_TYPE = {
  BONUS: 'bonus',
  BONUSDEPOSIT: 'bonusdeposit'
}

export const BONUS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FORFEIT: 'FORFEITED',
  EXPIRED: 'EXPIRED',
  CLAIMING: 'CLAIMING',
  IN_PROCESS: 'IN-PROCESS',
  LAPSED: 'LAPSED',
  CLAIMED: 'CLAIMED'
}

export const WAGER_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const KEYS = {
  MAX_BONUS_THRESHOLD: 'maxBonusThreshold',
  MIN_DEPOSIT: 'minDeposit',
  MAX_WIN_AMOUNT: 'maxWinAmount',
  ZERO_OUT_THRESHOLD: 'zeroOutThreshold',
  MIN_BALANCE: 'minBalance'
}

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30
}

export const STRICTLY_REQUIRED_REGISTRATION_FIELDS = [
  'email',
  'password',
  'firstName',
  'username',
  'lastName',
  'dateOfBirth',
  'address',
  'gender',
  'countryCode',
  'currencyCode'
]

export const REPORTING_CURRENCY = 'EUR'
export const MAX_QUANTITY = 100
export const ACCOUNT_TYPE = 'REAL'

export const COUNTRY_CURRENCY_MAPPER = {
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BA: 'BAM',
  BB: 'BBD',
  WF: 'XPF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BT: 'BTN',
  JM: 'JMD',
  BV: 'NOK',
  BW: 'BWP',
  WS: 'WST',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  JE: 'GBP',
  BY: 'BYR',
  BZ: 'BZD',
  RU: 'RUB',
  RW: 'RWF',
  RS: 'RSD',
  TL: 'USD',
  RE: 'EUR',
  TM: 'TMT',
  TJ: 'TJS',
  RO: 'RON',
  TK: 'NZD',
  GW: 'XOF',
  GU: 'USD',
  GT: 'GTQ',
  GS: 'GBP',
  GR: 'EUR',
  GQ: 'XAF',
  GP: 'EUR',
  JP: 'JPY',
  GY: 'GYD',
  GG: 'GBP',
  GF: 'EUR',
  GE: 'GEL',
  GD: 'XCD',
  GB: 'GBP',
  GA: 'XAF',
  SV: 'USD',
  GN: 'GNF',
  GM: 'GMD',
  GL: 'DKK',
  GI: 'GIP',
  GH: 'GHS',
  OM: 'OMR',
  TN: 'TND',
  JO: 'JOD',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  HK: 'HKD',
  HN: 'HNL',
  HM: 'AUD',
  VE: 'VEF',
  PR: 'USD',
  PS: 'ILS',
  PW: 'USD',
  PT: 'EUR',
  SJ: 'NOK',
  PY: 'PYG',
  IQ: 'IQD',
  PA: 'PAB',
  PF: 'XPF',
  PG: 'PGK',
  PE: 'PEN',
  PK: 'PKR',
  PH: 'PHP',
  PN: 'NZD',
  PL: 'PLN',
  PM: 'EUR',
  ZM: 'ZMK',
  EH: 'MAD',
  EE: 'EUR',
  EG: 'EGP',
  ZA: 'ZAR',
  EC: 'USD',
  IT: 'EUR',
  VN: 'VND',
  SB: 'SBD',
  ET: 'ETB',
  SO: 'SOS',
  ZW: 'ZWL',
  SA: 'SAR',
  ES: 'EUR',
  ER: 'ERN',
  ME: 'EUR',
  MD: 'MDL',
  MG: 'MGA',
  MF: 'EUR',
  MA: 'MAD',
  MC: 'EUR',
  UZ: 'UZS',
  MM: 'MMK',
  ML: 'XOF',
  MO: 'MOP',
  MN: 'MNT',
  MH: 'USD',
  MK: 'MKD',
  MU: 'MUR',
  MT: 'EUR',
  MW: 'MWK',
  MV: 'MVR',
  MQ: 'EUR',
  MP: 'USD',
  MS: 'XCD',
  MR: 'MRO',
  IM: 'GBP',
  UG: 'UGX',
  TZ: 'TZS',
  MY: 'MYR',
  MX: 'MXN',
  IL: 'ILS',
  FR: 'EUR',
  IO: 'USD',
  SH: 'SHP',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NA: 'NAD',
  VU: 'VUV',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NZ: 'NZD',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  CK: 'NZD',
  XK: 'EUR',
  CI: 'XOF',
  CH: 'CHF',
  CO: 'COP',
  CN: 'CNY',
  CM: 'XAF',
  CL: 'CLP',
  CC: 'AUD',
  CA: 'CAD',
  CG: 'XAF',
  CF: 'XAF',
  CD: 'CDF',
  CZ: 'CZK',
  CY: 'EUR',
  CX: 'AUD',
  CR: 'CRC',
  CW: 'ANG',
  CV: 'CVE',
  CU: 'CUP',
  SZ: 'SZL',
  SY: 'SYP',
  SX: 'ANG',
  KG: 'KGS',
  KE: 'KES',
  SS: 'SSP',
  SR: 'SRD',
  KI: 'AUD',
  KH: 'KHR',
  KN: 'XCD',
  KM: 'KMF',
  ST: 'STD',
  SK: 'EUR',
  KR: 'KRW',
  SI: 'EUR',
  KP: 'KPW',
  KW: 'KWD',
  SN: 'XOF',
  SM: 'EUR',
  SL: 'SLL',
  SC: 'SCR',
  KZ: 'KZT',
  KY: 'KYD',
  SG: 'SGD',
  SE: 'SEK',
  SD: 'SDG',
  DO: 'DOP',
  DM: 'XCD',
  DJ: 'DJF',
  DK: 'DKK',
  VG: 'USD',
  DE: 'EUR',
  YE: 'YER',
  DZ: 'DZD',
  US: 'USD',
  UY: 'UYU',
  YT: 'EUR',
  UM: 'USD',
  LB: 'LBP',
  LC: 'XCD',
  LA: 'LAK',
  TV: 'AUD',
  TW: 'TWD',
  TT: 'TTD',
  TR: 'TRY',
  LK: 'LKR',
  LI: 'CHF',
  LV: 'EUR',
  TO: 'TOP',
  LT: 'LTL',
  LU: 'EUR',
  LR: 'LRD',
  LS: 'LSL',
  TH: 'THB',
  TF: 'EUR',
  TG: 'XOF',
  TD: 'XAF',
  TC: 'USD',
  LY: 'LYD',
  VA: 'EUR',
  VC: 'XCD',
  AE: 'AED',
  AD: 'EUR',
  AG: 'XCD',
  AF: 'AFN',
  AI: 'XCD',
  VI: 'USD',
  IS: 'ISK',
  IR: 'IRR',
  AM: 'AMD',
  AL: 'ALL',
  AO: 'AOA',
  AQ: '',
  AS: 'USD',
  AR: 'ARS',
  AU: 'AUD',
  AT: 'EUR',
  AW: 'AWG',
  IN: 'INR',
  AX: 'EUR',
  AZ: 'AZN',
  IE: 'EUR',
  ID: 'IDR',
  UA: 'UAH',
  QA: 'QAR',
  MZ: 'MZN'
}

export const LIMIT_TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: 'disable',
    1: 'primary'
  }
}

export const EMAIL_TEMPLATE_TYPES = {
  ACTIVE_USER: 'Active User',
  IN_ACTIVE_USER: 'In-Active User',
  EMAIL_VERIFICATION: 'Email Verification',
  RESET_PASSWORD: 'Reset Password',
  KYC_REJECTED: 'KYC Rejected',
  KYC_VERIFIED: 'KYC Verified',
  KYC_REQUESTED: 'KYC Requested',
  KYC_REMINDER: 'KYC Reminder',
  KYC_RECEIVED: 'KYC Received',
  KYC_APPROVED: 'KYC Approved',
  WITHDRAW_REQUEST_RECEIVED: 'Redeem Request Received',
  WITHDRAW_APPROVED: 'Redeem Approved',
  DEPOSIT_SUCCESS: 'Purchase Success',
  REGISTRATION_WELCOME: 'Registration Welcome',
  PHONE_VERIFICATION: 'Phone Verification',
  PASSWORD_RESET_CONFIRMED: 'Password Reset Confirmed',
  IDENTITY_VERIFICATION: 'Identity Verification',
  SUCCESSFUL_IDENTITY_VERIFICATION: 'Successful Identity Verification',
  RESPONSIBLE_GAMBLING_PURCHASE_LIMIT: 'Responsible Gaming Purchase Limit',
  RESPONSIBLE_GAMBLING_TAKE_A_BREAK: 'Responsible Gaming Take a Break',
  RESPONSIBLE_GAMBLING_SESSION_REMINDER: 'Responsible Gaming Session Redminder',
  RESPONSIBLE_GAMBLING_TIME_LIMIT: 'Responsible Gaming Time Limit',
  RESPONSIBLE_GAMBLING_SELF_EXCLUSION: 'Responsible Gaming Self Exclusion',
  RESPONSIBLE_GAMBLING_SETTING_CHANGE: 'Responsible Gaming Setting Change',
  VALUE_T0_INT: {
    'Active User': 0,
    'In-Active User': 1,
    'Email Verification': 2,
    'Reset Password': 3,
    'KYC Rejected': 4,
    'KYC Verified': 5,
    'KYC Requested': 6,
    'KYC Reminder': 7,
    'KYC Received': 8,
    'KYC Approved': 9,
    'Redeem Request Received': 10,
    'Redeem Approved': 11,
    'Purchase Success': 12,
    'Registration Welcome': 13,
    'Phone Verification': 14,
    'Password Reset Confirmed': 15,
    'Identity Verification': 16,
    'Successful Identity Verification': 17,
    'Responsible Gaming Purchase Limit': 18,
    'Responsible Gaming Take a Break': 19,
    'Responsible Gaming Session Redminder': 20,
    'Responsible Gaming Time Limit': 21,
    'Responsible Gaming Self Exclusion': 22,
    'Responsible Gaming Setting Change': 23
  },
  INT_TO_VALUE: {
    0: 'Active User',
    1: 'In-Active User',
    2: 'Email Verification',
    3: 'Reset Password',
    4: 'KYC Rejected',
    5: 'KYC Verified',
    6: 'KYC Requested',
    7: 'KYC Reminder',
    8: 'KYC Received',
    9: 'KYC Approved',
    10: 'Redeem Request Received',
    11: 'Redeem Approved',
    12: 'Purchase Success',
    13: 'Registration Welcome',
    14: 'Phone Verification',
    15: 'Password Reset Confirmed',
    16: 'Identity Verification',
    17: 'Successful Identity Verification',
    18: 'Responsible Gaming Purchase Limit',
    19: 'Responsible Gaming Take a Break',
    20: 'Responsible Gaming Session Redminder',
    21: 'Responsible Gaming Time Limit',
    22: 'Responsible Gaming Self Exclusion',
    23: 'Responsible Gaming Setting Change'
  }
}

export const EMAIL_TEMPLATE_ORDER = [
  'Manual',
  'Email Verification',
  'Phone Verification',
  'Registration Welcome',
  'Reset Password',
  'Password Reset Confirmed',
  'Identity Verification',
  'Successful Identity Verification',
  'Responsible Gaming Purchase Limit',
  'Responsible Gaming Take a Break',
  'Responsible Gaming Session Redminder',
  'Responsible Gaming Time Limit',
  'Responsible Gaming Self Exclusion',
  'Responsible Gaming Setting Change',
  'Active User',
  'In-Active User',
  'KYC Verified',
  'KYC Rejected',
  'KYC Requested',
  'KYC Reminder',
  'KYC Received',
  'KYC Approved',
  'Redeem Request Received',
  'Redeem Approved',
  'Purchase Success'
]

export const EMAIL_ALLOWED_KEYS = [
  'SiteName',
  'siteLogo',
  'subject',
  'userName',
  'walletAmountTotal',
  'walletAmountBonus',
  'walletAmountReal',
  'siteUrl',
  'reason',
  'link',
  'redeemAmount',
  'depositAmount',
  'transactionId',
  'playerEmail',
  'playerFullName',
  'playerFirstName',
  'playerLastName',
  'supportEmailAddress',
  'kycLabels',
  'siteLoginUrl',
  'playerCurrencySymbol',
  'sendSupportRequestRoute',
  'redeemRequestedDate',
  'scCoin',
  'gcCoin',
  'currentDate',
  'paymentType',
  'value',
  'identifier'
]

export const TEMPLATE_KEY = [
  'userName',
  'playerEmail',
  'siteLogo',
  'siteName',
  'playerFirstName',
  'playerLastName'
]
export const EMAIL_TEMPLATES = [
  {
    name: 'Upcoming Event Notification',
    templateCategoryId: 1,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Promotional Notification',
    templateCategoryId: 2,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Site Maintenance Notification',
    templateCategoryId: 3,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Active User Notification',
    templateCategoryId: 4,
    required: TEMPLATE_KEY,
    optional: []
  },
  {
    name: 'Inactive User Notification',
    templateCategoryId: 5,
    required: TEMPLATE_KEY,
    optional: []
  }
]
export const EMAIL_TEMPLATES_KEYS = {
  0: {
    required: ['siteName', 'siteUrl', 'siteLogo'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  1: {
    required: ['siteName', 'siteUrl', 'siteLogo', 'reason'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  2: {
    required: ['link', 'userName'],
    optional: [
      'playerEmail',
      'siteName',
      'siteUrl',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress'
    ]
  },
  3: {
    required: ['link'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol'
    ]
  },
  4: {
    required: ['kycLabels', 'reason'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  5: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  6: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  7: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  8: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  9: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  10: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  11: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  12: {
    required: [
      'transactionId',
      'depositAmount',
      'scCoin',
      'gcCoin',
      'currentDate',
      'paymentType',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'sendSupportRequestRoute',
      'playerCurrencySymbol'
    ]
  },
  13: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  14: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  15: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  16: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  17: {
    required: ['userName', 'siteUrl'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  18: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  19: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  20: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  21: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  22: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  23: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  }
}

export const EMAIL_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'subject',
    description: 'If not given, default subject line will be used'
  },
  {
    key: 'userName',
    description: "This will be replaced by User's unique username"
  },
  {
    key: 'walletAmountTotal',
    description: "This will be replaced by User's total wallet amount"
  },
  {
    key: 'walletAmountBonus',
    description: "This will be replaced by User's non-cash wallet amount"
  },
  {
    key: 'walletAmountReal',
    description: "This will be replaced by User's cash wallet amount"
  },
  {
    key: 'siteUrl',
    description: "This will be replaced by site's URL"
  },
  {
    key: 'reason',
    description: 'This will be replaced by valid reason for triggering email'
  },
  {
    key: 'link',
    description:
      'Dynamically generated link from backend (Reset Password, Email Confirmation)'
  },
  {
    key: 'redeemAmount',
    description: 'This will be replaced by redeem request amount'
  },
  {
    key: 'depositAmount',
    description: 'This will be replaced by deposit amount'
  },
  {
    key: 'transactionId',
    description:
      'This will be replaced by transaction Id for (Deposit / Redeem)'
  },
  {
    key: 'playerEmail',
    description: "This will be replaced by player's email address"
  },
  {
    key: 'playerFullName',
    description:
      "This will be replaced by player's full name (first name + last name)"
  },
  {
    key: 'playerFirstName',
    description: "This will be replaced by player's first name"
  },
  {
    key: 'playerLastName',
    description: "This will be replaced by player's last name"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  },
  {
    key: 'kycLabels',
    description:
      'This will be replaced by kyc label for pending, approved, rejected'
  },
  {
    key: 'siteLoginUrl',
    description: 'This will be replaced by user login route'
  },
  {
    key: 'playerCurrencySymbol',
    description: "This will be replaced by user's currency symbol"
  },
  {
    key: 'sendSupportRequestRoute',
    description:
      'This will be replaced by route for compose support email page.'
  },
  {
    key: 'redeemRequestedDate',
    description: 'This will be replaced by requested redeem date.'
  },
  {
    key: 'scCoin',
    description: 'This will be replaced by SC coin value.'
  },
  {
    key: 'gcCoin',
    description: 'This will be replaced by GC coin value.'
  },
  {
    key: 'currentDate',
    description: 'This will be replaced by Current date'
  },
  {
    key: 'paymentType',
    description: 'This will be replaced by payment type used.'
  },
  {
    key: 'value',
    description: 'This will be replaced by deposit value used.'
  },
  {
    key: 'identifier',
    description: 'This will be replaced by identifier used.'
  }
]

export const BONUS_ACTIONS = ['cancel-bonus', 'issue-bonus']

export const CMS_ALLOWED_KEYS = ['siteName', 'siteLogo', 'supportEmailAddress']

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  }
]

export const MAP_AGGREGATOR = {
  softswiss: 'swissSoft',
  amantic: 'amantic'
}

export const MAP_GENDER = {
  Female: 'f',
  Male: 'm',
  F: 'f',
  M: 'm',
  'Not to say': 'm',
  Other: 'm'
}

export const LEVEL = 1

export const defaultLanguage = 'EN'
export const defaultBase64 = 'BASE64'
export const defaultUtf8 = 'utf8'
export const BANNER_KEYS = [
  'homeBanner',
  'homeBackground',
  'loyaltyBanner',
  'loyaltyBackground',
  'promotionsBanner',
  'promotionsBackground',
  'casinoBanner',
  'casinoBackground'
]

export const USER_ACTIVITIES_TYPE = {
  SIGNUP: 'sign-up',
  LOGIN: 'login',
  DAILY_BONUS_CLAIMED: 'daily-bonus-claimed',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  DAILY_BONUS_CANCELLED: 'daily-bonus-cancelled',
  WELCOME_BONUS_CLAIMED: 'welcome-bonus-claimed',
  REFERRAL_BONUS_CLAIMED: 'referral-bonus-claimed',
  LOGOUT: 'logout',
  PROMOTION_BONUS_CLAIMED: 'promotion-bonus-claimed',
  AFFILIATE_BONUS_CLAIMED: 'affiliate-bonus-claimed',
  WHEEL_SPIN_BONUS: 'wheel-spin-bonus',
  PROMOCODE_APPLIED: 'promocode-applied',
  POSTAL_CODE_CLAIMED: 'postal-code-bonus-claimed',
  GC_BONUS_CLAIMED: 'gc-bonus-claimed',
  PROVIDER_BONUS_RECEIVED: 'provider-bonus-received',
  AMOE_BONUS_CLAIMED: 'amoe-bonus-claimed',
  VIP_QUESTIONNAIRE_BONUS: 'vip-questionnaire-bonus-claimed'
}

export const BANK_ACCOUNT_TYPE = {
  CHECKING: '0',
  SAVINGS: '1'
}

export const SUMSUB_APPLICANT_TYPES = [
  'applicantCreated',
  'applicantPending',
  'applicantOnHold',
  'videoIdentStatusChanged',
  'applicantDeleted',
  'applicantPrechecked',
  'applicantActionOnHold'
]

export const SUMSUB_APPLICANT_REVIEW_TYPES = [
  'applicantReviewed',
  'applicantActionReviewed',
  'applicantReset'
]
export const SUMSUB_REVIEW_TYPE = 'GREEN'
export const LOGICAL_ENTITY = {
  PROVIDER: 'provider',
  SUB_CATEGORY: 'sub-category',
  BANNER: 'banner',
  PACKAGE: 'package',
  BONUS: 'bonus',
  POSTAL_CSV: 'postal-csv',
  DIGITAL_ASSET: 'digital',
  USER_PROFILE: 'user-profile',
  TIER: 'tier',
  RAFFLE_BANNER: 'raffle-banner',
  PROMOTION_THUMBNAIL: 'promotion-thumbnail',
  GAME_PAGE: 'game-pages',
  SCRATCH_CARD: 'scratch-card'
}

export const RESPONSIBLE_GAMBLING_STATUS = {
  ACTIVE: '1',
  IN_ACTIVE: '0',
  COOLING_PERIOD: '2'
}

export const RESPONSIBLE_GAMBLING_LIMIT = {
  DAILY: '1',
  WEEKLY: '2',
  MONTHLY: '3'
}

export const RESPONSIBLE_GAMBLING_TYPE = {
  BET: '1',
  PURCHASE: '2',
  TIME: '3',
  TIME_BREAK: '4',
  SELF_EXCLUSION: '5'
}

export const SIGN_IN_METHOD = {
  NORMAL: '0',
  GOOGLE: '1',
  FACEBOOK: '2',
  APPLE: '3'
}

export const ACTION_TYPE = {
  ALL: 'all',
  BONUS: '4',
  LOST: '3',
  CANCEL: '2',
  CREDIT: '1',
  DEBIT: '0',
  PENDING_OR_LOST: null
}

export const REGEX = {
  // PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{10,}$/
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_=+[{\]}|;:'",.<>/?]).{8,20}$/
}

export const UPDATE_USER_STATUS = {
  PHONE_VERIFICATION: 1,
  RESTRICT_USER: 2,
  BAN_UNBAN_USER: 3,
  INTERNAL_USER: 4,
  REDEMPTION_SUBSCRIPTION: 5,
  SUBSCRIPTION: 6,
  VERIFF_VERIFICATION: 7,
  LN_VERIFICATION: 8,
  PERSONAL_DETAILS: 9,
  BANK_DETAILS: 10,
  VERIFIED: 11,
  ACTIVE_USER: 12
}

export const WALLET_OPERATION_TYPE = {
  ADD: 1,
  DEDUCT: 2
}

export const DOCUMENTS = {
  ID: 'ID_PROOF',
  ADDRESS: 'ADDRESS_PROOF',
  BANK_CHECKING: 'BANK_CHECKING',
  BANK_SAVINGS: 'BANK_SAVINGS',
  SSN: 'SSN',
  OTHER: 'OTHER'
}

export const EMAIL_LOGS_SOURCE = {
  SMS: 'SMS',
  PUSH: 'push',
  TRANSACTIONAL: 'transactional',
  VERIFICATION: 'verification',
  CRM: 'CRM'
}

export const POSTAL_CODE_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  REJECTED: 2
}
export const KYC_STATUS = {
  ACCOUNT_CREATED: 'K0',
  ACCOUNT_EMAIL_VERIFIED: 'K1',
  ACCOUNT_PROFILE_COMPLETED: 'K2',
  ACCOUNT_VERIFIED_PHONE: 'K3',
  ACCOUNT_KYC_VERIFIED: 'K4',
  ACCOUNT_FULLY_VERIFIED: 'K5'
}

export const RULE_ACTIVITIES = {
  REDEMPTIONS: 1,
  LOGIN: 2,
  REGISTRATION: 3,
  PURCHASE: 4,
  WIN: 5
}

export const TWO_FACTOR_AUTH = {
  issuer: 'moneyFactory',
  label: 'moneyFactory',
  algorithm: 'SHA1',
  digits: 6,
  period: 30
}

export const PAGE_ASSET_TYPE = {
  TEXT: '1',
  DIGITAL: '2',
  MESSAGE: '3'
}

export const FILE_NAME = {
  RECONCILIATION: 'Reconciliation_Report',
  REDEMPTION: 'Redemption_Report',
  EXCEEDING: 'Exceeding_Redemption_Report',
  PURCHASE: 'Purchase_Report',
  FAILED: 'Failed_Purchase_Report',
  NEW: 'New_Registered_Player',
  LEXIS: 'Lexis_Nexis_Failed',
  GAME: 'Game_Report',
  TOP_200_PURCHASERS: 'Top_200_Purchasers_Report',
  TOP_200_REDEEMERS: 'Top_200_Redeemers_Report',
  INACTIVE_PLAYERS: 'Inactive_Players_Report',
  BUSINESS_ECONOMY: 'Business_Economy_Report',
  USER_JOURNEY: 'User_Journey_Report',
  ACQUISITION_TOTAL: 'Acquisition_Total_Report',
  PENDING_VERIFICATION: 'Pending_Verification',
  PLAYER_WITHOUT_PURCHASE: 'Without_Purchase',
  ACQUISITION_DETAIL: 'Acquisition_Detail_Report',
  COIN_STORE_PACKAGES: 'Coin_Store_Packages_Report',
  COIN_DISTRIBUTION_OVERVIEW: 'Coin_Distribution_Overview_Report',
  DORMANT_PLAYERS_WITH_BALANCE_REPORT: 'Dormant_Players_With_Balance_Report'
}

export const ACCESS_EMAIL_TEMPLATES = {
  VERIFY_EMAIL: {
    name: 'Verify Email',
    templateId: 'd-510797fa613b43dcbb2d36aa367e42ca'
  },
  FORGET_PASSWORD: {
    name: 'Forget Password',
    templateId: 'd-f4e69e81fa5f4162b956ce8c50a14ff0'
  },
  VERIFY_FORGET_PASSWORD: {
    name: 'Verify Forget Password',
    templateId: ''
  },
  WELCOME_MAIL: {
    name: 'Welcome Mail',
    templateId: ''
  },
  PROFILE_UPDATED: {
    name: 'Profile Updated',
    templateId: ''
  },
  REDEEM_REQUEST_APPROVED: {
    name: 'Redeem Request Approved',
    templateId: 'd-e5bfecacbbc447a1a46bab74afcd55c2'
  },
  DEACTIVATE_USER: {
    name: 'Deactivate User',
    templateId: 'd-ce57f9aedf3c490e8813e384f0f0972d'
  },
  ACTIVATE_USER: {
    name: 'Activate User',
    templateId: 'd-07b40d8d5490441797edba4a03c6fcb6'
  },
  APPROVED_VIP_USER: {
    name: 'Vip Approved',
    templateId: 'd-c4ed6c56a0814815bcf369769cae0b3f'
  }
}

export const SEND_EMAIL_TYPES = {
  EMAIL_VERIFICATION: 'email',
  RESET_PASSWORD: 'passwordReset'
}

export const DASHBOARD_REPORT = {
  LOGIN_DATA: 'loginData',
  LOGIN_DATA_TILL_DATE: 'loginDataTillDate',
  CUSTOMER_DATA: 'customerData',
  CUSTOMER_DATA_TEST: 'customerDataTest',
  TRANSACTION_DATA: 'transactionData',
  TRANSACTION_DATA_TEST: 'transactionDataTest',
  ECONOMY_DATA: 'economyData',
  ECONOMY_DATA_TEST: 'economyDataTest',
  DASHBOARD_REPORT: 'dashboardData',
  LOGIN_DATA_OPTIMIZED: 'loginDataOptimized',
  DASHBOARD_REPORT_OPTIMIZED: 'dashboardDataOptimized',
  BONUS_DATA: 'bonusData'
}

export const TOURNAMENT_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2,
  CANCELLED: 3
}

export const INVERTED_TRANSACTION_STATUS = Object.entries(
  TRANSACTION_STATUS
).reduce((acc, [key, value]) => {
  acc[value] = key.substring(0, 1).toUpperCase() + key.slice(1).toLowerCase()
  return acc
}, {})

export const INVERTED_AMOUNT_TYPE = Object.entries(AMOUNT_TYPE).reduce(
  (acc, [key, value]) => {
    acc[value] = key.replaceAll('_', ' ')
    return acc
  },
  {}
)

export const RAFFLE_STATUS = {
  COMPLETED: 'completed',
  ONGOING: 'ongoing',
  UPCOMING: 'upcoming'
}

export const PROMOTION_EVENT_STATUS = {
  PROMO_CREATED: 0,
  USER_REGISTERED: 1,
  BONUS_AVAILED: 2
}

export const TIME_ZONES = {
  IDLW: '-12:00', // International Date Line West         //Pacific/Fiji
  NT: '-11:00', // Nome Time
  HST: '-10:00', // Hawaii Standard Time         //HST
  AKST: '-09:00', // Alaska Standard Time        //America/Anchorage
  PST: '-08:00', // Pacific Standard Time        //US/Pacific
  MST: '-07:00', // Mountain Standard Time       // MST
  CST: '-06:00', // Central Standard Time        //America/Mexico_City
  EST: '-05:00', // Eastern Standard Time        //EST
  AST: '-04:00', // Atlantic Standard Time       //America/Barbados
  NST: '-03:30', // Newfoundland Standard Time        //America/St_Johns
  BRT: '-03:00', // Brasília Time                //Brazil/East
  'GST-2': '-02:00', // South Georgia and the South Sandwich Islands Time        //Atlantic/South_Georgia
  AZOT: '-01:00', // Azores Standard Time                                        //Atlantic/Azores
  GMT: '+00:00', // Greenwich Mean Time                                          //GMT
  CET: '+01:00', // Central European Time                                        //CET
  EET: '+02:00', // Eastern European Time                                        //Europe/Sofia
  MSK: '+03:00', // Moscow Standard Time                                         //Europe/Moscow
  IRST: '+03:30', // Iran Standard Time                                          //Iran
  GST: '+04:00', // Gulf Standard Time                                           //Europe/Samara
  IST: '+05:30', // Indian Standard Time                                         //Asia/Kolkata
  BST: '+06:00', // Bangladesh Standard Time                                     //Asia/Dhaka
  ICT: '+07:00', // Indochina Time                                               //Asia/Bangkok
  'CST+8': '+08:00', // China Standard Time                                      //Asia/Shanghai
  JST: '+09:00', // Japan Standard Time                                          //Japan
  ACST: '+09:30', // Australian Central Standard Time                            //Australia/North
  AEST: '+10:00', // Australian Eastern Standard Time                            //Australia/Brisbane
  SBT: '+11:00', // Solomon Islands Time                                         //Pacific/Noumea
  NZST: '+12:00', // New Zealand Standard Time                                   //Pacific/Auckland
  NZDT: '+13:00', // New Zealand Daylight Time                                   //Pacific/Chatham
  LINT: '+14:00' // Line Islands Time                                            //Pacific/Kiritimati
}

export const PACKAGE_USER_FILTER = {
  NGR: 'ngr',
  GGR: 'ggr',
  DEPOSIT: 'deposit',
  RTP: 'rtp',
  HOUSE_EDGE: 'house-edge'
}

export const USER_STATUS = {
  isActive: 'In-Active',
  isBan: 'Ban',
  isRestrict: 'Restrict',
  Active: 'Active',
  isInternalUser: 'Internal-User',
  selfExclusion: 'Self-Excluded',
  timeBreakDuration: 'Time-Break'
}

export const CSV_FILE_STATIC_NAMES = {
  PLAYERS_DATA: 'players_data',
  BANKING_TRANSACTIONS_DATA: 'banking_transactions_data',
  REDEEM_REQUESTS_DATA: 'redeem_requests_data',
  CASINO_TRANSACTIONS_DATA: 'casino_transactions_data'
}

export const EXPORT_CSV_STATUS = {
  PENDING: 'pending'
}

export const CRM_PROMOTION_TYPE = {
  SCHEDULED: 'scheduled-campaign',
  TRIGGERED: 'triggered-campaign'
}

export const CSV_TYPE = {
  REDEEM_REQUEST_CSV: 'redeem_requests_csv_download',
  TRANSACTION_BANKING_CSV: 'transactions_banking_csv_download',
  PLAYERS_CSV: 'players_csv_download',
  PLAYER_ACTIVITY_CSV: 'player_activity_csv_download',
  CASINO_TRANSACTION_CSV: 'casino_transactions_csv_download',
  VAULT_DATA_CSV: 'vault_data_csv_download',
  PROMOCODE_BLOCKED_USERS_CSV: 'promocode_blocked_users_csv_download',
  TOURNAMENT_CSV: 'tournament_csv_download',
  GAME_DASHBOARD_CSV: 'game_dashboard_csv_download',
  PROMOCODE_APPLIED_HISTORY_CSV: 'promocode_applied_history_csv_download',
  PURCHASE_REPORT_CSV: 'purchase_report_csv_download',
  MERV_REPORT_CSV: 'merv_report_csv_download',
  REDEMPTION_RATE_REPORT_CSV: 'redemption_rate_report_csv_download'
}

export const PAYMENT_METHOD = {
  PAYSAFE: 'PAYSAFE',
  PAY_BY_BANK: 'PAY_BY_BANK',
  SKRILL: 'SKRILL',
  CARD: 'CARD',
  APPLE_PAY: 'APPLE_PAY'
}

export const CASINO_ACTION_TYPE = {
  BALANCE: 'balance',
  BET: 'bet',
  WIN: 'win',
  BET_WIN: 'bet_win',
  CANCEL: 'cancel',
  CANCEL_BET_WIN: 'cancel_bet_win'
}

export const AMOE_BONUS_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2
}

export const TIMEZONES_WITH_DAYLIGHT_SAVINGS = {
  AoE: 'Etc/GMT+12', // UTC−12:00 (e.g. Baker Island)
  SST: 'Pacific/Pago_Pago', // UTC−11:00 (American Samoa)
  NUT: 'Pacific/Niue', // UTC−11:00 (Niue)
  HST: 'Pacific/Honolulu', // UTC−10:00 (Hawaii)
  AKST: 'America/Anchorage', // UTC−09:00 (Alaska)
  PST: 'America/Los_Angeles', // UTC−08:00 (US Pacific)
  MST: 'America/Denver', // UTC−07:00 (US Mountain)
  CST: 'America/Chicago', // UTC−06:00 (US Central)
  EST: 'America/New_York', // UTC−05:00 (US Eastern)
  AST: 'America/Halifax', // UTC−04:00 (Atlantic, Canada)
  NST: 'America/St_Johns', // UTC−03:30 (Newfoundland)
  ART: 'America/Argentina/Buenos_Aires', // UTC−03:00 (Argentina)
  BRT: 'America/Sao_Paulo', // UTC−03:00 (Brazil)
  FNT: 'America/Noronha', // UTC−02:00 (Fernando de Noronha, Brazil)
  AZOT: 'Atlantic/Azores', // UTC−01:00 (Azores, Portugal)
  GMT: 'Etc/GMT', // UTC±00:00 (United Kingdom)
  UTC: 'Etc/UTC',
  WET: 'Africa/Casablanca', // UTC±00:00 (Morocco)
  CET: 'Europe/Paris', // UTC+01:00 (Central Europe)
  WAT: 'Africa/Lagos', // UTC+01:00 (West Africa, e.g. Nigeria)
  EET: 'Europe/Athens', // UTC+02:00 (Eastern Europe)
  'IST+2': 'Asia/Jerusalem', // UTC+02:00 (Israel – using plain IST per PostgreSQL)
  SAST: 'Africa/Johannesburg', // UTC+02:00 (South Africa)
  CAT: 'Africa/Harare', // UTC+02:00 (Central Africa)
  MSK: 'Europe/Moscow', // UTC+03:00 (Moscow, Russia)
  EAT: 'Africa/Nairobi', // UTC+03:00 (East Africa)
  TRT: 'Europe/Istanbul', // UTC+03:00 (Turkey)
  ARST: 'Asia/Riyadh', // UTC+03:00 (Arabia Standard Time – Saudi Arabia; renamed to avoid AST clash)
  IRST: 'Asia/Tehran', // UTC+03:30 (Iran)
  GST: 'Asia/Dubai', // UTC+04:00 (Gulf Standard Time; UAE)
  AZT: 'Asia/Baku', // UTC+04:00 (Azerbaijan)
  GET: 'Asia/Tbilisi', // UTC+04:00 (Georgia)
  AFT: 'Asia/Kabul', // UTC+04:30 (Afghanistan)
  PKT: 'Asia/Karachi', // UTC+05:00 (Pakistan)
  UZT: 'Asia/Tashkent', // UTC+05:00 (Uzbekistan)
  IST: 'Asia/Kolkata', // UTC+05:30 (India – disambiguated)
  SLST: 'Asia/Colombo', // UTC+05:30 (Sri Lanka)
  NPT: 'Asia/Kathmandu', // UTC+05:45 (Nepal)
  BST: 'Asia/Dhaka', // UTC+06:00 (Bangladesh Standard Time)
  BTT: 'Asia/Thimphu', // UTC+06:00 (Bhutan)
  ALMT: 'Asia/Almaty', // UTC+06:00 (Kazakhstan – Almaty)
  CCT: 'Indian/Cocos', // UTC+06:30 (Cocos Islands)
  MMT: 'Asia/Rangoon', // UTC+06:30 (Myanmar)
  ICT: 'Asia/Bangkok', // UTC+07:00 (Thailand/Indochina)
  WIB: 'Asia/Jakarta', // UTC+07:00 (Western Indonesia)
  'CST+8': 'Asia/Shanghai', // UTC+08:00 (China Standard Time; disambiguated)
  HKT: 'Asia/Hong_Kong', // UTC+08:00 (Hong Kong)
  SGT: 'Asia/Singapore', // UTC+08:00 (Singapore)
  MYT: 'Asia/Kuala_Lumpur', // UTC+08:00 (Malaysia)
  CWST: 'Australia/Eucla', // UTC+08:45 (Central Western Standard Time – Eucla, Australia)
  JST: 'Asia/Tokyo', // UTC+09:00 (Japan)
  KST: 'Asia/Seoul', // UTC+09:00 (South Korea)
  TLT: 'Asia/Dili', // UTC+09:00 (East Timor)
  ACST: 'Australia/Darwin', // UTC+09:30 (Australian Central Standard Time)
  AEST: 'Australia/Sydney', // UTC+10:00 (Australian Eastern Standard Time)
  VLAT: 'Asia/Vladivostok', // UTC+10:00 (Vladivostok, Russia)
  PGT: 'Pacific/Port_Moresby', // UTC+10:00 (Papua New Guinea)
  LHST: 'Australia/Lord_Howe', // UTC+10:30 (Lord Howe Island)
  NCT: 'Pacific/Noumea', // UTC+11:00 (New Caledonia)
  FJT: 'Pacific/Fiji', // UTC+11:00 (Fiji)
  NZST: 'Pacific/Auckland', // UTC+12:00 (New Zealand)
  FUT: 'Pacific/Fakaofo', // UTC+12:00 (Tokelau)
  CHAST: 'Pacific/Chatham', // UTC+12:45 (Chatham Islands, New Zealand)
  TOT: 'Pacific/Tongatapu', // UTC+13:00 (Tonga)
  LINT: 'Pacific/Kiritimati' // UTC+14:00 (Line Islands, Kiribati)
}

export const ACTION_MAP = {
  C: 'create',
  R: 'read',
  U: 'update',
  D: 'delete',
  T: 'toggle'
}

export const VIP_STATUS = {
  REJECTED: 'rejected',
  APPROVED: 'approved',
  PENDING: 'pending'
}

export const QUESTIONNAIRE_QUESTION_TYPE = {
  ONE_LINER: 'one_liner',
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  TICK_MARK: 'tick_mark',
  SEQUENCE: 'sequence'
}

export const PROMOCODE_STATUS = {
  UPCOMING: 0,
  ACTIVE: 1,
  EXPIRED: 2,
  DELETED: 3
}

export const JACKPOT_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2
}

export const CASINO_BONUS_TYPE_ALIAS = {
  amoeBonus: 'amoe-bonus',
  tierBonus: 'tier-bonus',
  dailyBonus: 'daily-bonus',
  rafflePayout: 'raffle-payout',
  welcomeBonus: 'welcome-bonus',
  jackpotWinner: 'jackpotWinner',
  providerBonus: 'provider-bonus',
  referralBonus: 'referral-bonus',
  affiliateBonus: 'affiliate-bonus',
  promotionBonus: 'promotion-bonus',
  weeklyTierBonus: 'weekly-tier-bonus',
  monthlyTierBonus: 'monthly-tier-bonus',
  tournamentWinner: 'tournament'
}

export const USER_CATEGORY = {
  ACTIVE: 'active',
  INTERNAL: 'internal',
  BANNED: 'banned',
  RESTRICTED: 'restricted',
  INACTIVE: 'inactive',
  SELF_EXCLUDED: 'selfExcluded'
}

export const TEMPLATE_CATEGORY = {
  FREE_SPIN: 'freeSpin'
}

export const FREE_SPIN_TYPE = {
  DIRECT_GRANT: 'directGrant',
  ATTACHED_GRANT: 'attachedGrant'
}

export const FREE_SPINS_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  EXPIRED: 4
}

export const FREE_SPIN_AGGREGATOR = {
  PRAGMATIC: 'PRAGMATIC',
  MANCALA: 'MANCALA',
  EVOPLAY: 'EVOPLAY',
  BGAMING: 'BGAMING',
  ALEA: 'ALEA',
  RUBYPLAY: 'RUBYPLAY',
  GAMZIX: 'GAMZIX',
  MASCOT: 'MASCOT',
  BOOMING: 'BOOMING'
}

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PAUSE: 'paused',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RENEWED: 'renewed',
  UPGRADED: 'upgraded'
}

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
