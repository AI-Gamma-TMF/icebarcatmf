export const tableHeaders = [
    { labelKey: 'Tier Id', value: 'tierId' },
    { labelKey: 'Name', value: 'name' },
    { labelKey: 'Required Xp', value: '' },
    { labelKey: 'Bonus Gc', value: 'bonusGc' },
    { labelKey: 'Bonus Sc', value: 'bonusSc' },
    { labelKey: 'Weekly Bonus Percentage', value: 'weeklyBonusPercentage' },
    { labelKey: 'Weekly Bonus Status', value: 'isWeekelyBonusActive' },
    { labelKey: 'Monthly Bonus Percentage', value: 'monthlyBonusPercentage' },
    { labelKey: 'Monthly Bonus Status', value: 'isMonthlyBonusActive' },
    { labelKey: 'Level', value: 'level' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Image', value: '' },
    { labelKey: 'Actions', value: '' },
]
export const leaderTableHeaders = [
  { labelKey: 'User Id', value: 'userId' },
  // { labelKey: '.tournamentId', value: 'tournamentId' },
  { labelKey: 'Username', value: '' },
  { labelKey: 'Max Level', value: '' },
  { labelKey: 'level', value: '' },
  { labelKey: 'Xp', value: 'requiredXp' },
  { labelKey: 'SC Spend', value: '' },
  { labelKey: 'GC Spend', value: '' },
]

export const initialWinnerPercentage ={
  1:[100],
  2:[50,50],
  3:[50,30,20],
  4:[40,30,20,10],
  5:[35,30,20,10,5]
 }