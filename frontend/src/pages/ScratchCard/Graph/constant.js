export const bonusTableHeaders = [
  { labelKey: 'Bonus Type', value: '' },
  { labelKey: 'CUSTOM_DATE_BONUS_REPORT', value: '' },
  { labelKey: 'LAST_MONTH_BONUS_REPORT', value: '' },
  { labelKey: 'Number of Users', value: 'totalNoOfUsers' },
  { labelKey: 'Intervals', value: 'intervals' },
]

export const tableData = [
  'TODAY',
  'YESTERDAY',
  'MONTH_TO_DATE',
  'LAST_MONTH',
  'TILL_DATE',
  'CUSTOM'
]

export const intervalOptions = [
  { label: "Auto", value: "auto" },
  { label: "30 min", value: "30-minutes" },
  { label: "1 hour", value: "hour" },
  { label: "3 hour", value: "3-hours" },
  { label: "12 hour", value: "12-hours" },
  { label: "1 day", value: "day" },
  { label: "3 day", value: "3-days" },
  { label: "1 week", value: "week" },
  { label: "1 month", value: "month" },
];

export const bonusTypeOptions = [
  { label: "All", value: "all" },
  { label: "Amoe Bonus", value: "amoeBonus" },
  { label: "Tier Bonus", value: "tierBonus" },
  { label: "Daily Bonus", value: "dailyBonus" },
  { label: "Package Bonus", value: "packageBonus" },
  { label: "Raffle Payout", value: "rafflePayout" },
  { label: "Welcome Bonus", value: "welcomeBonus" },
  { label: "Jackpot Winner", value: "jackpotWinner" },
  // { label: "Personal Bonus", value: "personalBonus" },
  { label: "Provider Bonus", value: "providerBonus" },
  { label: "Referral Bonus", value: "referralBonus" },
  { label: "VIP Questionnaire Bonus", value: "vipQuestionnaireBonus" },
  { label: "Scratch Card Bonus", value: "scratchCardBonus" },
  { label: "Affiliate Bonus", value: "affiliateBonus" },
  { label: "Promotion Bonus", value: "promotionBonus" },
  // { label: "Wheel Spin Bonus", value: "wheelSpinBonus" },
  { label: "Weekly Tier Bonus", value: "weeklyTierBonus" },
  { label: "Monthly Tier Bonus", value: "monthlyTierBonus" },
  { label: "Tournament Winner", value: "tournamentWinner" },
  { label: "Admin Added SC Bonus", value: "adminAddedScBonus" },
  { label: "CRM Promocode Bonus", value: "crmPromocodeBonus" },
  { label: "Purchase Promocode Bonus", value: "purchasePromocodeBonus" },
];

export const getRandomColor = (i) => {
  const colors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba', '#e6194B', '#3cb44b', '#ffe119'];
  return colors[i % colors.length];
};

export const BONUS_TYPE_COLOR_MAP = {
  amoeBonus: '#4dc9f6',
  tierBonus: '#f67019',
  dailyBonus: '#f53794',
  packageBonus: '#537bc4',
  rafflePayout: '#acc236',
  welcomeBonus: '#166a8f',
  jackpotWinner: '#00a950',
  providerBonus: '#58595b',
  referralBonus: '#8549ba',
  affiliateBonus: '#e6194B',
  promotionBonus: '#3cb44b',
  weeklyTierBonus: '#ffe119',
  monthlyTierBonus: '#4363d8',
  tournamentWinner: '#f58231',
  adminAddedScBonus: '#911eb4',
  crmPromocodeBonus: '#46f0f0',
  purchasePromocodeBonus: '#f032e6',
  scratchCardBonus: '#B8860B'
};

export const bonusMetricOptions = [
  { label: 'SC Bonus', value: 'scBonus' },
  { label: 'GC Bonus', value: 'gcBonus' },
  { label: 'Total Claimed', value: 'totalNoOfUsers' }
];

export const autoRefreshOptions = [
  { label: "Off", value: "off" },
  { label: "5 seconds", value: "5s" },
  { label: "10 seconds", value: "10s" },
  { label: "15 seconds", value: "15s" },
  { label: "20 seconds", value: "20s" },
  { label: "1 minute", value: "1m" },
  { label: "3 minutes", value: "3m" },
  { label: "5 minutes", value: "5m" },
  { label: "10 minutes", value: "10m" },
  { label: "15 minutes", value: "15m" }
];

export const intervalMap = {
  "5s": 5000,
  "10s": 10000,
  "15s": 15000,
  "20s": 20000,
  "1m": 60000,
  "3m": 180000,
  "5m": 300000,
  "10m": 600000,
  "15m": 900000
};



